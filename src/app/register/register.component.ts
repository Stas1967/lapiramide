import { Component, HostListener, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fireAuth, fireDb } from '../app.module';
import { Router } from '@angular/router';
import { BehavService } from '../services/behav.service';
import { AutentService } from '../services/autent.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isSmall: boolean;
  hidefpass = true;
  hiderpass = true;
  wrongpass = false;
  logform = new FormGroup({
    logemail: new FormControl('', [Validators.email, Validators.required, Validators.pattern('[a-z0-9]{3,}@[a-z]{2,}.[a-z]{2,}')]),
    logpassw: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })

  auth = fireAuth;
  db = fireDb;
  constructor(private dialog: MatDialog, private route: Router, public bhvsrv: BehavService, private autsrv: AutentService) {
    this.isSmall = bhvsrv.isMobilFu();
  }
  @HostListener('window:resize', ['$event'])
  ngOnResize() {
    this.isSmall = this.bhvsrv.isMobilFu();
  }
  getEmailErrorMsg(): string {
    const emailctrl = this.logform.controls['logemail'];
    if (emailctrl.hasError('required')) {
      return 'Email is required' || '';
    } else if (emailctrl.hasError('pattern')) {
      return 'Email is incorrect format';
    }
    return emailctrl.hasError('email') ? 'Email is incorrect format' : '';
  }

  getPassErrorMsg(): string {
    const fpass = this.logform.controls['logpassw'];
    if (fpass.hasError('required')) {
      return 'Password is required' || '';
    } else if (this.wrongpass === true) {
      return 'Wrong passowrd';
    }
    return fpass.hasError('password') ? 'Password is to short' : ''
  }

  LogUser(): void {
    const email = this.logform.controls['logemail'].value || '';
    const password = this.logform.controls['logpassw'].value || '';
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        // El usuario se ha creado exitosamente
        // actualizar el registro previamente creado con añadir nuevo usuario
        const user = userCredential.user;
        await setDoc(doc(this.db, "empleados", user.uid), this.logform.value);
      })
      .catch((error) => {
        // Ha ocurrido un error
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
}

