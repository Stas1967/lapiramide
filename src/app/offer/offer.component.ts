import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BehavService } from '../services/behav.service';
import { BookinghomeComponent } from '../bookinghome/bookinghome.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { Rooms } from '../administrator/apartments/apartments.component';
import { fireRdb, refdb } from '../app.module';
import { MatTableDataSource } from '@angular/material/table';
import { onValue } from 'firebase/database';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule, BookinghomeComponent, MatCardModule, MatButtonModule,
    MatIconModule, MatExpansionModule],
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent {
  isSmall: boolean;
  datestart: Date;
  dateend: Date;
  countdays: number;
  roomList: Rooms[] | undefined;
  rdb = fireRdb;
  adult = 0;
  child = 0;
  dataSource!: MatTableDataSource<Rooms>;
  constructor(public router: Router, public bhvsrv: BehavService,) {
    this.isSmall = bhvsrv.isMobilFu();
    this.datestart = bhvsrv.getDate().start
    this.dateend = bhvsrv.getDate().end;
    this.countdays = bhvsrv.getDate().countdays;
  }

  countDays(event: number) {
    this.countdays = event;
  }

  Adults(inumber: number): Array<number> {
    return Array(inumber).fill(0);
  }
  Childrend(inumber: number): Array<number> {
    return Array(inumber).fill(0);;
  }
  getRoomsAsync(): void {
    let templist: Rooms[] = [];
    onValue(refdb(this.rdb, 'apartments'), (snap) => {
      templist = [];
      snap.forEach((urx) => {
        const data = urx.val() as Rooms
        templist.push(data);
      })
      //this.dataSource = new MatTableDataSource(templist);
      this.roomList = templist
      templist.forEach((rft) => {
        this.adult = rft.adults;
        this.child = rft.child;
      })
    })

  }

  ngOnInit(): void {
    this.getRoomsAsync();
  }

  @HostListener('window:resize', ['$event'])
  ngOnResize() {
    this.isSmall = this.bhvsrv.isMobilFu();
  }
}
