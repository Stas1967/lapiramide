import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fireRdb, refdb } from '../app.module';
import { MatTableDataSource } from '@angular/material/table';
import { onValue } from 'firebase/database';
import { MyEvent } from '../classes/EventsClass';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  rdb = fireRdb;
  dataSource!: MatTableDataSource<any>;
  eventList: BehaviorSubject<MyEvent[]> | undefined;

  ulist: any[] = [];
  isEvent = true;
  getEvents = async () => {
    let templist: MyEvent[] = [];
    onValue(refdb(this.rdb, 'eventos'), (snap) => {
      templist = [];
      if (snap.exists()) {
        this.isEvent = true;
        snap.forEach((urx) => {
          const data = urx.val() as MyEvent
          templist.push(data);
        })
        this.dataSource = new MatTableDataSource(templist);
        this.eventList = this.dataSource.connect();
      } else {
        this.isEvent = false
      }

    })
  }

  ngOnInit(): void {
    this.getEvents();
  }
}
