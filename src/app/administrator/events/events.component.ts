import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { onValue, push, remove, set } from 'firebase/database';
import { fireRdb, refdb } from 'src/app/app.module';
import { BehavService } from 'src/app/services/behav.service';
import { RoomImg } from '../apartments/apartments.component';
import { MyEvent } from 'src/app/classes/EventsClass';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  standalone: true,
  styleUrls: ['./events.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatSelectModule, MatDialogModule, MatButtonModule, MatTableModule,
    ReactiveFormsModule, MatRippleModule,],
})
export class EventsComponent {
  rdb = fireRdb;
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['position', 'img', 'evento', 'startevent', 'endevent', 'promo', 'repeate', 'delete', 'edit'];

  sevenday: Date | undefined;
  constructor(public dialog: MatDialog) { }
  openDialog(): void {
    this.dialog.open(NewEvent, { disableClose: true })
  }
  getEvents = async () => {
    let templist: MyEvent[] = [];
    onValue(refdb(this.rdb, 'eventos'), (snap) => {
      templist = [];
      snap.forEach((urx) => {
        const data = urx.val() as MyEvent
        const id = urx.key;
        templist.push({ ...data, id });
      })
      this.dataSource = new MatTableDataSource(templist);
    })
  }
  deleteEvent(eve: MyEvent): void {
    if (window.confirm('Estas seguro que quieres eliminar este evento')) {
      remove(refdb(this.rdb, 'eventos/' + eve.id));
    }
  }

  editEvent(eve: MyEvent): void {
    this.dialog.open(NewEvent, {
      disableClose: true, data: {
        id: eve.id,
        image: eve.image,
        eventtitle: eve.eventtitle,
        startevent: eve.startevent,
        endevent: eve.endevent,
        eventdescrip: eve.eventdescrip,
        repeate: eve.repeate,
        finpromo: eve.finpromo,
        cuantdays: eve.cuantdays,
        isPromo: eve.isPromo || false,
      }
    })
  }
  ngOnInit(): void {
    this.getEvents();
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
  isPromo = false;
  isEdited = false;
  imgEveChang = './assets/images/OIG.jpeg';
  eventform = new FormGroup({
    eventtitle: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    startevent: new FormControl(new Date(), Validators.required),
    endevent: new FormControl(new Date(), Validators.required),
    eventdescrip: new FormControl('', Validators.required),
    repeate: new FormControl(false),
    finpromo: new FormControl(true),
    cuantdays: new FormControl(0, Validators.required),
  })
  startDateNum = 0;
  endDateNum = 0;
  constructor(private bhvsrv: BehavService, public roomimg: MatDialog, public snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public eve: MyEvent, public dialRef: MatDialogRef<NewEvent>) { }

  openEventImg() {
    this.roomimg.open(RoomImg, { width: '100%', data: { bigimg: true } }).afterClosed().subscribe((rem) => {
      this.eventform.controls.image.setValue(rem);
      this.imgEveChang = rem;
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
        isPromo: this.isPromo
      }).catch((err) => {
        console.log(err);
      });
      this.dialRef.close();
      this.bhvsrv.passSpin(false);
    } else {
      const snackRef = this.snack.open('Rellena todos los campos del formulario', 'Ok',
        {
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      snackRef.afterDismissed().subscribe((sn) => {
        console.log('dismised');
      });
      snackRef.onAction().subscribe((sn) => {
        console.log('Action');

      })
    }
    this.bhvsrv.passSpin(false);
  }
  promoChange(event: MatSlideToggleChange): void {
    this.isPromo = event.checked;
  }
  updateEvent(eve: any): void {
    if (this.eventform.valid) {
      set(refdb(this.rdb, 'eventos/' + eve.id), {
        image: this.eventform.controls.image.value,
        eventtitle: this.eventform.controls.eventtitle.value,
        startevent: this.startDateNum,
        endevent: this.endDateNum,
        eventdescrip: this.eventform.controls.eventdescrip.value,
        repeate: this.eventform.controls.repeate.value,
        finpromo: this.eventform.controls.finpromo.value,
        cuantdays: this.eventform.controls.cuantdays.value,
        isPromo: this.isPromo
      })
      this.dialRef.close();
    }
  }

  ngOnInit(): void {
    if (this.eve) {
      this.imgEveChang = this.eve.image;
      this.isPromo = this.eve.isPromo || false;
      this.isEdited = true;
      this.startDateNum = this.eve.startevent,
        this.endDateNum = this.eve.endevent
      this.eventform.setValue({
        image: this.imgEveChang,
        eventtitle: this.eve.eventtitle,
        startevent: new Date(this.eve.startevent),
        endevent: new Date(this.eve.endevent),
        eventdescrip: this.eve.eventdescrip,
        repeate: this.eve.repeate,
        finpromo: this.eve.finpromo,
        cuantdays: this.eve.cuantdays,

      })
    }
  }
}

