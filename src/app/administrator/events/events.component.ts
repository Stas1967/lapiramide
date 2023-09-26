import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { onValue, push } from 'firebase/database';
import { fireRdb, refdb } from 'src/app/app.module';
import { BehavService } from 'src/app/services/behav.service';
import { RoomImg } from '../apartments/apartments.component';
import { MyEvent } from 'src/app/classes/EventsClass';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  standalone: true,
  styleUrls: ['./events.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatSelectModule, MatDialogModule, MatButtonModule, MatTableModule,
    ReactiveFormsModule, MatRippleModule,],
})
export class EventsComponent {
  rdb = fireRdb;
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['position', 'img', 'evento', 'startevent', 'endevent', 'repeate', 'edit'];
  dateA: Date | undefined;
  sevenday: Date | undefined;
  constructor(public dialog: MatDialog) { }
  openDialog(): void {
    this.dialog.open(NewEvent)
  }
  getEvents = async () => {
    let templist: MyEvent[] = [];
    onValue(refdb(this.rdb, 'eventos'), (snap) => {
      templist = [];
      snap.forEach((urx) => {
        const data = urx.val() as MyEvent
        templist.push(data);
      })
      this.dataSource = new MatTableDataSource(templist);
    })
  }
  ngOnInit(): void {
    this.getEvents();
    this.dateA = new Date(new Date().setDate(new Date().getDate()));
    const dateanum = this.dateA.getTime();
    if (dateanum <= Date.now()) {
      this.dateA = new Date(new Date().setDate(new Date().getDate() + 7));
    }
  }
}

@Component({
  selector: 'dial-event',
  templateUrl: './addevent.html',
  styleUrls: ['./events.component.css']
})
export class NewEvent {
  rdb = fireRdb;
  today = new Date();
  eventform = new FormGroup({
    eventtitle: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    startevent: new FormControl('', Validators.required),
    endevent: new FormControl('', Validators.required),
    eventdescrip: new FormControl('', Validators.required),
    repeate: new FormControl(false),
    finpromo: new FormControl(true),
    cuantdays: new FormControl(0, Validators.required),
  })
  startDateNum = 0;
  endDateNum = 0;
  constructor(private bhvsrv: BehavService, public roomimg: MatDialog,) { }

  openEventImg() {
    this.roomimg.open(RoomImg, { width: '100%', data: { bigimg: true } }).afterClosed().subscribe((rem) => {
      this.eventform.controls.image.setValue(rem);
    })
  }

  startdatechange(event: any): void {
    const startdate = new Date(event.value);
    this.startDateNum = startdate.getTime();
  }
  enddatechange(event: any): void {
    const enddate = new Date(event.value);
    this.endDateNum = enddate.getTime();
  }
  saveEvent(): void {
    this.bhvsrv.passSpin(true);
    if (this.eventform.valid) {

      push(refdb(this.rdb, 'eventos/'), {
        image: this.eventform.controls.image.value,
        eventtitle: this.eventform.controls.eventtitle.value,
        startevent: this.startDateNum,
        endevent: this.endDateNum,
        eventdescrip: this.eventform.controls.eventdescrip.value,
        repeate: this.eventform.controls.repeate.value,
        finpromo: this.eventform.controls.finpromo.value,
        cuantdays: this.eventform.controls.cuantdays.value,
      }).catch((err) => {
        console.log(err);
      });
      this.bhvsrv.passSpin(false);
    } else {
      alert(" Rellena todos los campos del formulario")
    }
    this.bhvsrv.passSpin(false);
  }
}

export interface EventData {
  mini: string;
  big: string;
  alt: string;
  isok: string;
  bigimg: boolean;
}
