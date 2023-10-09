import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NuserGuard {
  isInvited: boolean;
  isInvited$ = new BehaviorSubject<boolean>(false);
  constructor(public acRoute: ActivatedRoute, private router: Router) {
    this.isInvited = false;
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    return true
  }

  getNewUser(): Observable<boolean> {
    return this.acRoute.queryParams.pipe(
      map((param) => {
        console.log(param['encodeEmail']);
        this.isInvited = param['encodeEmail'] != undefined
        this.isInvited$.next(this.isInvited);
        return this.isInvited;
      })
    );
  }

}
