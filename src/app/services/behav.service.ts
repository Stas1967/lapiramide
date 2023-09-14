import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import { fireDb } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class BehavService {
  db = fireDb;
  isMobile: boolean;
  isMobile$ = new BehaviorSubject<boolean>(false);
  isTablet: boolean;
  isTablet$ = new BehaviorSubject<boolean>(false);
  appside: boolean | undefined;
  appside$ = new BehaviorSubject<boolean>(false);
  constructor(public bpo: BreakpointObserver) {
    this.isMobile = false;
    this.isTablet = false;
  }


  sideNavFu(value: boolean): boolean {
    this.appside = value;
    this.appside$.next(this.appside);
    return this.appside
  }

  isSideNavOpenFu(): boolean {
    return this.appside$.value;
  }

  isMobilFu(): boolean {
    this.bpo.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
    ]).subscribe((media) => {
      this.isMobile = media.matches
      this.isMobile$.next(this.isMobile)
    })
    return this.isMobile;
  }

  isTabletFu(): boolean {
    this.bpo.observe([
      Breakpoints.Tablet,
      Breakpoints.TabletLandscape,
    ]).subscribe((media) => {
      this.isMobile = media.matches
      this.isMobile$.next(this.isMobile)
    })
    return this.isMobile;
  }

  appsideNav(value: boolean): boolean {
    this.appside = value;
    this.appside$.next(this.appside);
    return this.appside
  }

  async getBlogDoc(pti: string) {
    const buip = doc(this.db, 'blog', pti);
    try {
      const docache = await getDocFromCache(buip);
      if (docache.exists()) {
        return docache
      } else {
        const doserv = await getDocFromServer(buip)
        return doserv
      }
    } catch (error) {
      const doc = await getDocFromServer(buip)
      return doc
    }
  }
}
