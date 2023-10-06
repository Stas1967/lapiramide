import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { BehavService } from '../services/behav.service';
import { BookinghomeComponent } from '../bookinghome/bookinghome.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { Rooms } from '../administrator/apartments/apartments.component';
import { fireAuth, fireRdb, refdb } from '../app.module';
import { MatTableDataSource } from '@angular/material/table';
import { onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule, BookinghomeComponent, MatCardModule, MatButtonModule,
    MatIconModule, MatExpansionModule, RouterOutlet, RouterModule],
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent {
  auth = fireAuth;
  isSmall: boolean;
  datestart: Date;
  dateend: Date;
  countdays: number;
  roomList: Rooms[] | undefined;
  rdb = fireRdb;
  adult = 0;
  child = 0;
  dataSource!: MatTableDataSource<Rooms>;
  isAdmin = true;
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
  Childrends(inumber: number): Array<number> {
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

  loQuiero(rm: Rooms): void {
    this.router.navigate(['/reserva'],
      {
        queryParams: {
          SetP: encodeURIComponent(rm.price),
          SetB: encodeURIComponent(rm.breakfast),
          SetH: encodeURIComponent(rm.halfboard),
          SetF: encodeURIComponent(rm.fullboard),
          BF: encodeURIComponent(rm.isbreakfast),
          HD: encodeURIComponent(rm.ishalfboard),
          FA: encodeURIComponent(rm.isfullboard),
          Ad: encodeURIComponent(rm.adults),
          Ch: encodeURIComponent(rm.child)

        }
      })
    // this.bhvsrv.setRoomData({
    //   Breakfast: rm.isbreakfast,
    //   HalfBoard: rm.ishalfboard,
    //   FullBoard: rm.isfullboard
    // })
    //this.router.navigate(['/reserva']);
  }

  ngOnInit(): void {
    this.getRoomsAsync();
    onAuthStateChanged(this.auth, (user) => {
      if (user?.uid == 'BhnhoDJMP8PG6tawS8QhbPDGURA3' || user?.uid == 'e4sebbsmWoRvpsiGtarEAIKpptA3') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  ngOnResize() {
    this.isSmall = this.bhvsrv.isMobilFu();
  }
}
