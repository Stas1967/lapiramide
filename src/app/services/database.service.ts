import { Injectable } from '@angular/core';
import { fireRdb, refdb } from '../app.module';
import { equalTo, onValue, orderByChild, query, ref } from 'firebase/database';
import { MyEvent } from '../classes/EventsClass';
export class ListaImg {
  id: string;
  mini: string;
  big: string;
  alt: string;
  togalery: boolean
  constructor(id: string, mini: string, big: string, alt: string, togalery: boolean) {
    this.id = id;
    this.mini = mini;
    this.big = big;
    this.alt = alt;
    this.togalery = togalery;
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

  getImgToGalery(): ListaImg[] {
    let imglist: ListaImg[] = [];
    const ImgToGal = query(ref(this.realdb, 'lapiramide'), orderByChild('togalery'), equalTo(true));
    onValue(ImgToGal, (snap) => {
      snap.forEach((imi) => {
        const dane = imi.val() as ListaImg;
        const id = imi.key;
        imglist.push({ ...dane, id })
      })
    }, { onlyOnce: true });
    return imglist;
  }

  getEvents = async () => {
    let templist: MyEvent[] = [];
    onValue(refdb(this.realdb, 'eventos'), (snap) => {
      templist = [];
      if (snap.exists()) {
        snap.forEach((urx) => {
          const data = urx.val() as MyEvent
          templist.push(data);
        },)

      } else {

      }
    }, { onlyOnce: true })
  }

}

