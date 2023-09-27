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
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehavService } from '../services/behav.service';
import { AutentService } from '../services/autent.service';

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
  constructor(private dialog: MatDialog, private route: Router, public ac: ActivatedRoute,
    public bhvsrv: BehavService, private autsrv: AutentService) {
    this.isSmall = bhvsrv.isMobilFu();
    ac.queryParams.subscribe((param) => {
      console.log(param['email']);

    })
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
    const logEmail = this.logform.controls['logemail'].value || '';
    const logPassw = this.logform.controls['logpassw'].value || '';
    this.autsrv.LogIn(logEmail, logPassw).then((user) => {

    });
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

