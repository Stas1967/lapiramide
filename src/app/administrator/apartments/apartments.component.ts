import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { onValue, push, set } from 'firebase/database';
import { BehaviorSubject } from 'rxjs';
import { fireRdb, refdb } from 'src/app/app.module';
import { BehavService } from 'src/app/services/behav.service';
import { DatabaseService, ListaImg } from 'src/app/services/database.service';
import { DialogData } from '../cardimg/cardimg.component';
export interface Rooms {
  title: string,
  whathave: string,
  shortdescrip: string,
  adults: number,
  child: number,
  price: number,
  image: string,
}

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  standalone: true,
  styleUrls: ['./apartments.component.css'],
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatSelectModule, MatDialogModule, MatButtonModule, MatTableModule],
})
export class ApartmentsComponent {
  rdb = fireRdb;
  dataSource!: MatTableDataSource<Rooms>;
  displayedColumns: string[] = ['position', 'img', 'title', 'adults', 'child', 'price', 'edit'];
  constructor(public dialog: MatDialog) { }
  openDialog() {
    this.dialog.open(AddNewRoom, { width: '100%' })
  }
  getRooms = async () => {
    let templist: Rooms[] = [];
    onValue(refdb(this.rdb, 'apartments'), (snap) => {
      templist = [];
      snap.forEach((urx) => {
        const data = urx.val() as Rooms
        templist.push(data);
      })
      this.dataSource = new MatTableDataSource(templist);
    })
  }

  ngOnInit(): void {
    this.getRooms();
  }

}

@Component({
  selector: 'dial-newroom',
  templateUrl: './addnewroom.html',
  styleUrls: ['./apartments.component.css'],
})
export class AddNewRoom {
  roomform = new FormGroup({
    title: new FormControl('', Validators.required),
    whathave: new FormControl('', Validators.required),
    shortdescrip: new FormControl('', Validators.required),
    adults: new FormControl('', Validators.required),
    child: new FormControl(0, Validators.required),
    price: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
  })
  rdb = fireRdb;
  constructor(public roomimg: MatDialog, public bhvsrv: BehavService,) { }

  openRoomImg() {
    this.roomimg.open(RoomImg, { width: '100%', data: { bigimg: false } }).afterClosed().subscribe((rem) => {
      this.roomform.controls.image.setValue(rem);
    })
  }

  saveRoom(): void {
    this.bhvsrv.passSpin(true);
    if (this.roomform.valid) {
      push(refdb(this.rdb, 'apartments/'), this.roomform.value);
      this.bhvsrv.passSpin(false);
    } else {
      alert(" Rellena todos los campos del formulario")
    }
    this.bhvsrv.passSpin(false);
  }
}

@Component({
  selector: 'dial-newimg',
  templateUrl: './roomimg.html',
  styleUrls: ['./apartments.component.css'],
})
export class RoomImg {
  imageList: BehaviorSubject<ListaImg[]> | undefined;
  tempimglist: ListaImg[] = []
  dataSource!: MatTableDataSource<ListaImg>;
  constructor(public dbsrv: DatabaseService, @Inject(MAT_DIALOG_DATA) public data: DialogData,) { }
  ngOnInit(): void {
    this.tempimglist = this.dbsrv.getImageList();
    this.dataSource = new MatTableDataSource<any>(this.tempimglist);
    this.imageList = this.dataSource.connect();
  }
}