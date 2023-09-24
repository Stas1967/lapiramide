import { Injectable } from '@angular/core';
import { fireRdb } from '../app.module';
import { onValue, ref } from 'firebase/database';
export class ListaImg {
  mini: string;
  big: string;
  alt: string;
  constructor(mini: string, big: string, alt: string) {
    this.mini = mini;
    this.big = big;
    this.alt = alt;
  }
}
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  realdb = fireRdb;

  constructor() {
  }

  getImageList(): ListaImg[] {
    const imglist: ListaImg[] = [];
    onValue(ref(this.realdb, 'lapiramide'), (snap) => {
      snap.forEach((imi) => {
        const dane = imi.val() as ListaImg;
        imglist.push(dane)
      })
    }, { onlyOnce: true });
    return imglist;
  }
}
