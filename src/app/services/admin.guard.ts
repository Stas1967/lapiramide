import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.getAuthKey() && this.getUIdTo() || this.getUIdRa()) {
      return true;
    } else {
      this.router.navigate(['/administrator/']);
      return false;
    }
  }

  getAuthKey(): boolean {
    return localStorage.getItem('authkey') === 'true'
  }

  getUIdTo(): boolean {
    return sessionStorage.getItem('uid') == 'e4sebbsmWoRvpsiGtarEAIKpptA3'
  }
  getUIdRa(): boolean {
    return sessionStorage.getItem('uid') == 'BhnhoDJMP8PG6tawS8QhbPDGURA3'
  }

}
