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
  isAuth(): Promise<{ isAuthenticated: boolean, uid: string | null }> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          resolve({ isAuthenticated: true, uid: user.uid });
        } else {
          this.route.navigateByUrl('/');
          resolve({ isAuthenticated: false, uid: null });
        }
      })
    });
  }


}
