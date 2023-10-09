import { Component, HostListener, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { fireAuth, fireRdb, refdb } from '../app.module';
import { ActivatedRoute, Router } from '@angular/router';
import { BehavService } from '../services/behav.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { MatSelectModule } from '@angular/material/select';
import { remove, set } from 'firebase/database';
import { ForbiddenValidatorDirective } from '../directives/forbiddenvalidator.directive';
import { Observable, map } from 'rxjs';


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
    firstname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    secondname: new FormControl(''),
    email: new FormControl('', [Validators.email, Validators.required, Validators.pattern('[a-z0-9]{3,}@[a-z]{2,}.[a-z]{2,}')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    dnidoc: new FormControl(''),
  })

  auth = fireAuth;
  rdb = fireRdb;
  memail = '';
  codekey = '';
  isInvited = false;
  constructor(public bhvsrv: BehavService, public acRoute: ActivatedRoute, private route: Router) {
    this.isSmall = bhvsrv.isMobilFu();
  }

  getNewUser(): Observable<boolean> {
    return this.acRoute.queryParams.pipe(
      map((param) => {
        console.log(param['encodeEmail']);
        return param['encodeEmail'] != undefined && param['codeKey'] != undefined;
      })
    );
  }


  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((param) => {
      this.isInvited = param['encodeEmail'] != undefined && param['codeKey'] != undefined ? true : false;
      if (this.isInvited == true) {
        this.memail = param['encodeEmail'];
        this.codekey = param['codeKey'];
        const emailctrl = this.logform.controls['email'];
        emailctrl.setValue(this.memail)
      } else {
        console.log('Nie ma danych');
        this.route.navigateByUrl('mistake')
      }

    })
  }
  @HostListener('window:resize', ['$event'])
  ngOnResize() {
    this.isSmall = this.bhvsrv.isMobilFu();
  }
  getEmailErrorMsg(): string {
    const emailctrl = this.logform.controls['email'];
    if (emailctrl.hasError('required')) {
      return 'Email is required' || '';
    } else if (emailctrl.hasError('pattern')) {
      return 'Email is incorrect format';
    }
    return emailctrl.hasError('email') ? 'Email is incorrect format' : '';
  }

  getPassErrorMsg(): string {
    const fpass = this.logform.controls['password'];
    if (fpass.hasError('required')) {
      return 'Password is required' || '';
    } else if (this.wrongpass === true) {
      return 'Wrong passowrd';
    }
    return fpass.hasError('password') ? 'Password is to short' : ''
  }

  LogUser(): void {
    const email = this.logform.controls['email'].value || '';
    const password = this.logform.controls['password'].value || '';
    this.bhvsrv.passSpin(true);
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(async () => {
        onAuthStateChanged(this.auth, async (user) => {
          await set(refdb(this.rdb, "users/" + user?.uid), this.logform.value);
        })
      }).finally(() => {
        remove(refdb(this.rdb, "tempuser/" + this.codekey))
        this.route.navigateByUrl('/')
        this.bhvsrv.passSpin(false);
      })
      .catch((error) => {
        // Ha ocurrido un error
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    this.bhvsrv.passSpin(false);
  }
}

