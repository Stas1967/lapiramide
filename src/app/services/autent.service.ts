import { Injectable } from '@angular/core';
import { fireAuth, fireDb } from '../app.module';
import { signOut, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { Router } from '@angular/router';


import { BehaviorSubject, Observable, of, from, fromEvent } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LogDialog } from '../login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AutentService {
  db = fireDb;
  auth = fireAuth;
  isaut: boolean | undefined;
  isaut$ = new BehaviorSubject<boolean>(false)
  constructor(private route: Router, private dialog: MatDialog) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        sessionStorage.setItem('uid', user.uid);
      } else {
        sessionStorage.removeItem('uid');
      }
    })
  }

  async LogIn(email: string, password: string): Promise<void> {
    return await signInWithEmailAndPassword(this.auth, email, password).then((res) => {
      if (res.user) {
        this.route.navigate(['/']);
        localStorage.setItem('authkey', 'true');
      }
    }).catch((err) => {
      console.log(err.code);
      if (err.code === 'auth/invalid-login-credentials') {
        this.openDialog('person_search', 'Upsss... Algo ha salido mal',
          'Comprueba los credenciales introducidas y intenta de nuevo', '',
          false, false);
      }
      if (err.code === 'auth/too-many-requests') {
        this.openDialog('person_search', 'Lo haz intentado demasidas vezes',
          'Espera unos minutos y intenta de nuevo', '', false, false);
      }
    });

  }
  openDialog(icon: string, title: string, text: string, prom: string, show: boolean, logreg: boolean): void {
    const dialRef = this.dialog.open(LogDialog, {
      data: { dialogicon: icon, dialogtitle: title, dialogtxt: text, dialogpromis: prom, show: show, logreg: logreg }
    })
  }


}
