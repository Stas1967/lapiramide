import { Component, Inject } from '@angular/core';
import { fireRdb, refdb } from 'src/app/app.module';
import { onValue, remove } from 'firebase/database';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehavService } from 'src/app/services/behav.service';

@Component({
  selector: 'app-bookinglist',
  templateUrl: './bookinglist.component.html',
  styleUrls: ['./bookinglist.component.css']
})
export class BookinglistComponent {
  rdb = fireRdb;
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['position', 'checkin', 'checkout', 'aloja', 'adults',
    'child', 'price', 'delete', 'edit'];

  constructor(public dialog: MatDialog, public snack: MatSnackBar, public bhvsrv: BehavService) { }
  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    let templist: any[] = [];
    onValue(refdb(this.rdb, 'reservas'), (snap) => {
      if (snap.exists()) {
        templist = [];
        snap.forEach((urx) => {
          const data = urx.val();
          const id = urx.key;
          templist.push({ ...data, id });
        })
        this.dataSource = new MatTableDataSource(templist);
      } else {
        console.log('no hay datos');
      }
    })
  }

  deleteRez(eve: any): void {
    this.bhvsrv.passSpin(true);
    remove(refdb(this.rdb, 'reservas/' + eve.id)).then((res) => {
      this.snack.open('El registro se elimino con exito', 'Ok', { duration: 3000 });
      this.dataSource = new MatTableDataSource();
      this.bhvsrv.passSpin(false);
    }).catch((err) => {
      console.log(err);
    })
    this.bhvsrv.passSpin(false);
  }

  viewRez(eve: any): void {
    this.dialog.open(ViewRez, { data: eve, disableClose: true, })
  }

}

@Component({
  selector: 'app-view',
  templateUrl: 'viewrez.html',
  styleUrls: ['bookinglist.component.css']
})
export class ViewRez {
  docu: { [key: string]: string | number } = {};
  constructor(@Inject(MAT_DIALOG_DATA) public data: { [key: string]: string | number } = {}) {


  }

}
