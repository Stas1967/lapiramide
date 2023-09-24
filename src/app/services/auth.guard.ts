import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.getAuthKey() && this.getUIdTomasz() || this.getUIdRaul()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  getAuthKey(): boolean {
    return localStorage.getItem('authkey') === 'true'
  }

  getUIdTomasz(): boolean {
    return sessionStorage.getItem('uid') === 'AYmtEeRlkYZrAcEodHQRguNSu5U2'
  }
  getUIdRaul(): boolean {
    return sessionStorage.getItem('uid') === 'CJeSDU1eLcS9PUMQZlArjEVIKVJ2'
  }
}
