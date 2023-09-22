import { Injectable } from '@angular/core';
import { fireAuth, fireDb } from '../app.module';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutentService {
  db = fireDb;
  auth = fireAuth;
  isaut: boolean
  isaut$ = new BehaviorSubject<boolean>(false)
  constructor(private route: Router) {
    this.isaut = false;
  }
  isAuth() {
    let isAuthenticated = false;
    let uid = '';
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        isAuthenticated = true;
        uid = user.uid;
        return { isAuthenticated, uid }
      } else {
        isAuthenticated = false;
        uid = '';
        this.route.navigateByUrl('/');
        return { isAuthenticated, uid }
      }
    })
    console.log(isAuthenticated, uid)
    return { isAuthenticated, uid }
  }

  getAuth(value: boolean): boolean {
    this.isaut = value;
    this.isaut$.next(value);
    return this.isaut
  }
  returnAuth(): boolean {
    return this.isaut$.value;
  }
}
