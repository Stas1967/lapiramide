import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import { fireDb } from '../app.module';
export class FoodPas {
  Breakfast: boolean;
  HalfBoard: boolean;
  FullBoard: boolean;
  constructor(Breakfast: boolean, HalfBoard: boolean, FullBoard: boolean) {
    this.Breakfast = Breakfast;
    this.HalfBoard = HalfBoard;
    this.FullBoard = FullBoard;
  }
}

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
  spinopen: boolean | undefined;
  spinopen$ = new BehaviorSubject<boolean>(false);
  _countDays = 0;
  _countDays$ = new BehaviorSubject<number>(0);
  roomData: FoodPas = { Breakfast: false, HalfBoard: false, FullBoard: false };
  _roomdata$ = new BehaviorSubject<FoodPas>({ Breakfast: false, HalfBoard: false, FullBoard: false })
  constructor(public bpo: BreakpointObserver) {
    this.isMobile = false;
    this.isTablet = false;
  }
  setRoomData(data: FoodPas) {
    this.roomData = data;
    this._roomdata$.next(this.roomData)
  }

  getRoomData() {
    return this._roomdata$.value;
  }
  passSpin(value: boolean): boolean {
    this.spinopen = value;
    this.spinopen$.next(this.spinopen);
    return this.spinopen;
  }
  isSpinerOn(): boolean {
    return this.spinopen$.value;
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

  getDate() {
    const dateA = parseInt(localStorage.getItem('startdate') || '')
    const dateB = parseInt(localStorage.getItem('enddate') || '')
    let start = new Date(dateA);
    let end = new Date(dateB);
    let countdays = 0;
    if (Date.now() > start.getTime()) {
      start = new Date();
      end = new Date(new Date().setDate(new Date().getDate() + 1));
    }
    if (Number.isNaN(dateA) && Number.isNaN(dateB)) {
      start = new Date();
      end = new Date(new Date().setDate(new Date().getDate() + 1));
    }
    const time = end.getTime() - start.getTime();
    this._countDays = Math.round(time / (1000 * 60 * 60 * 24))
    countdays = this._countDays;
    return { start: start, end, countdays };
  }
}
