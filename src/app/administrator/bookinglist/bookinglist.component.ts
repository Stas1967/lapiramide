import { Component } from '@angular/core';
import { fireRdb, refdb } from 'src/app/app.module';
import { onValue } from 'firebase/database';

@Component({
  selector: 'app-bookinglist',
  templateUrl: './bookinglist.component.html',
  styleUrls: ['./bookinglist.component.css']
})
export class BookinglistComponent {
  rdb = fireRdb;

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    onValue(refdb(this.rdb, 'reservas'), (snap) => {
      console.log(snap.val());
    })
  }

}
