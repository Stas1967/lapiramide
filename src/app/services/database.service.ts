import { Injectable } from '@angular/core';
import { fireRdb } from '../app.module';
import { onValue, ref } from 'firebase/database';
export class ListaImg {
  id: string;
  mini: string;
  big: string;
  alt: string;
  constructor(id: string, mini: string, big: string, alt: string) {
    this.id = id;
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
    let imglist: ListaImg[] = [];
    onValue(ref(this.realdb, 'lapiramide'), (snap) => {
      snap.forEach((imi) => {
        const dane = imi.val() as ListaImg;
        const id = imi.key;
        imglist.push({ ...dane, id })
      })
    }, { onlyOnce: true });
    return imglist;
  }
}
