import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fireRdb, refdb } from '../app.module';
import { MatTableDataSource } from '@angular/material/table';
import { onValue, update } from 'firebase/database';
import { MyEvent } from '../classes/EventsClass';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule,
    MatTooltipModule],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {
  rdb = fireRdb;
  dataSource!: MatTableDataSource<any>;
  eventList: BehaviorSubject<MyEvent[]> | undefined;
  ulist: any[] = [];
  isEvent = true;
  dateA: Date | undefined;
  isSameDate: number | undefined;
  getEvents = async () => {
    let templist: MyEvent[] = [];
    onValue(refdb(this.rdb, 'eventos'), (snap) => {
      templist = [];
      if (snap.exists()) {
        this.isEvent = true;
        snap.forEach((urx) => {
          const id = urx.key
          const data = urx.val() as MyEvent
          templist.push({ ...data, id });
        },)
        this.dataSource = new MatTableDataSource(templist);
        this.eventList = this.dataSource.connect();
      } else {
        this.isEvent = false
      }
    })
  }

  ngOnInit(): void {
    this.getEvents();
    setTimeout(() => {
      this.eventList?.subscribe((erd) => {
        erd.forEach((ef) => {
          if (ef.repeate == true) {
            if (ef.startevent < Date.now()) {
              update(refdb(this.rdb, 'eventos/' + ef.id), {
                startevent: this.returnDateF(ef.startevent, ef.cuantdays).getTime(),
              }).catch((err) => {
                console.log(err);
              })
            } else if (ef.endevent < Date.now()) {
              update(refdb(this.rdb, 'eventos/' + ef.id), {
                endevent: this.returnDateL(ef.endevent, ef.cuantdays).getTime(),
              }).catch((err) => {
                console.log(err);
              })
            }
          }
        })
      })
    }, 1000)
  }
  returnDate(): Date {
    this.dateA = new Date();
    this.dateA = new Date(new Date().setDate(new Date().getDate() + 7));
    return this.dateA;
  }
  returnDateF(fd: number, days: number): Date {
    let firstDate = new Date(fd);
    const dateF = firstDate.getTime();
    if (dateF <= Date.now()) {
      firstDate.setDate(firstDate.getDate() + days);
    }
    return firstDate;
  }
  returnDateL(ld: number, days: number): Date {
    let lastDate = new Date(ld);
    const dateL = lastDate.getTime();
    if (dateL <= Date.now()) {
      lastDate.setDate(lastDate.getDate() + days);
    }
    return lastDate;
  }
}
