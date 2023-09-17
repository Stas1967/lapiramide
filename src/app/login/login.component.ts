import { Component, HostListener, Inject, } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getAdditionalUserInfo, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { fireAuth } from '../app.module';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehavService } from '../services/behav.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isSmall: boolean;
  hidefpass = true;
  hiderpass = true;
  wrongpass = false;
  logform = new FormGroup({
    logemail: new FormControl('', [Validators.email, Validators.required, Validators.pattern('[a-z0-9]{3,}@[a-z]{2,}.[a-z]{2,}')]),
    logpassw: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })

  auth = fireAuth;
  constructor(private dialog: MatDialog, private route: Router, public bhvsrv: BehavService,) {
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
    return 'Password is to short' || ''
  }

  async LogUser(): Promise<void> {
    const logEmail = this.logform.controls['logemail'].value || '';
    const logPassw = this.logform.controls['logpassw'].value || '';
    await signInWithEmailAndPassword(this.auth, logEmail, logPassw).then((res) => {
      //this.spinsrv.passSpin(false);
      this.route.navigate(['/']);
    }).catch((err) => {
      if (err.code === 'auth/user-not-found') {
        this.logform.setValue({ logemail: '', logpassw: '' })
        this.openDialog('person_search', 'Upsss... Usuario no existe', 'No hemos encotrado el usuario con estas credenciales.', 'Si no tienes cuenta, pudes regístrarse', true, true);
      } else if (err.code === 'auth/wrong-password') {
        this.logform.patchValue({ logpassw: '' })
        this.openDialog('password', 'Contraseña incorrecta', '<p>La contraseña tiene que tener por lo menos una letra grande o pequeña (A o a) ' +
          'al principio<br />' +
          'Por lo menos tres numeros de 0 a 9<br />' +
          'Minimum&nbsp; de los caracteres tiene que ser 6 y maximum 12.</p>' +
          '<p>Por ejemplo: </p>' +
          '<ul>' +
          '<li>Aaa000</li>' +
          '<li>A00000</li>' +
          '<li>a00000</li>' +
          '<li>Aaaa00000000</li>' +
          '</ul>', '', false, true);
      }
    });
  }

  openDialog(icon: string, title: string, text: string, prom: string, show: boolean, logreg: boolean): void {
    const dialRef = this.dialog.open(LogDialog, {
      data: { dialogicon: icon, dialogtitle: title, dialogtxt: text, dialogpromis: prom, show: show, logreg: logreg }
    })
  }
}

@Component({
  selector: 'app-logindialog',
  templateUrl: './logindialog.html',
  styleUrls: ['./login.component.css']
})
export class LogDialog {


  constructor(
    public dialogRef: MatDialogRef<LogDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }
}

export interface DialogData {
  dialogicon: string;
  dialogtitle: string
  dialogtxt: string;
  dialogpromis: string;
  show: boolean;
  logreg: boolean;
}

