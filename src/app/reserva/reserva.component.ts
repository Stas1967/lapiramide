import { Component, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BehavService } from '../services/behav.service';
import { BookinghomeComponent } from '../bookinghome/bookinghome.component';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { fireAuth, fireRdb, refdb } from '../app.module';
import { onValue, set, update } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import { AutentService } from '../services/autent.service';
import { BoodocComponent } from '../boodoc/boodoc.component';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, BookinghomeComponent,
    MatIconModule, MatDialogModule, MatButtonModule,
    MatSnackBarModule, MatRadioModule, RouterModule, MatRippleModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent {
  rdb = fireRdb;
  auth = fireAuth;
  isSmall: boolean;
  countdays = 0;
  Price = 0;
  Breakfast: boolean | undefined;
  HalfBoard: boolean | undefined;
  FullBoard: boolean | undefined;
  BreakPrice = 0;
  HalfPrice = 0;
  FullPrice = 0;
  Adults = 0;
  Child = 0;
  CuotaOpt = 0;
  Cuota = 0;
  Alojamiento: string | undefined;
  AloNum = 0;
  Modificator = false;
  isNewRecord = true;
  reform = new FormGroup({
    fullname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required, Validators.pattern('[a-z0-9]{3,}@[a-z]{2,}.[a-z]{2,}')]),
    phone: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    message: new FormControl(''),
    alojamiento: new FormControl(this.AloNum)
  })
  constructor(public router: Router, public bhvsrv: BehavService, public acRoute: ActivatedRoute,
    private snack: MatSnackBar, public autsrv: AutentService, public dialog: MatDialog) {
    this.isSmall = bhvsrv.isMobilFu();
  }

  getEmailErrorMsg(): string {
    const emailctrl = this.reform.controls['email'];
    if (emailctrl.hasError('required')) {
      return 'Correo electronico es requerido' || '';
    } else if (emailctrl.hasError('pattern')) {
      return 'El correo electrónico tiene un formato incorrecto.';
    }
    return emailctrl.hasError('email') ? 'El correo electrónico tiene un formato incorrecto.' : '';
  }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((pa) => {
      this.Breakfast = pa['BF'] === 'true';
      this.HalfBoard = pa['HD'] === 'true';
      this.FullBoard = pa['FA'] === 'true';
      this.BreakPrice = Number(pa['SetB']);
      this.HalfPrice = Number(pa['SetH']);
      this.FullPrice = Number(pa['SetF']);
      this.Adults = Number(pa['Ad']);
      this.Child = Number(pa['Ch']);
      this.Price = Number(pa['SetP'])
    })
    this.countdays = this.bhvsrv.getDate().countdays;
  }
  countDays(event: number) {
    this.countdays = event;
  }
  radChange(event: MatRadioChange): void {
    this.AloNum = event.value;
    this.Alojamiento = event.source.ariaLabel;
    const prices = [0, this.BreakPrice, this.HalfPrice, this.FullPrice];
    this.CuotaOpt = prices[event.value];
    this.ToPay();
  }
  ToPay(): number {
    return (this.CuotaOpt * this.countdays) + (this.Price * this.countdays)
  }
  sendToServer(): void {
    const checkkey = localStorage.getItem('key');
    const getmail = localStorage.getItem('email');
    if (this.reform.valid) {
      if (checkkey == null) {
        signInAnonymously(this.auth).then((res) => {
          if (res) {
            localStorage.setItem('key', res.user.uid)
            set(refdb(this.rdb, 'reservas/' + res.user.uid), this.FormData(true)).then((res) => {
              this.dialog.open(BoodocComponent, { disableClose: true, })
            }).then(() => {
              this.reform.reset();
              this.router.navigateByUrl('events')
            }).catch((err) => {
              console.log(err);
            })
          }
        }).catch((err) => {
          console.log(err);
        })
      }
    } else if (checkkey != null) {
      const msnak = this.snack.openFromComponent(SnackMsg, { verticalPosition: 'top', horizontalPosition: 'right' });
      msnak.onAction().subscribe(() => {
        onValue(refdb(this.rdb, 'reservas/' + checkkey), (snap) => {
          if (snap.exists()) {
            const dane = snap.val();
            console.log(dane);
            this.reform.setValue({
              fullname: dane.fullname,
              email: dane.email,
              phone: dane.phone,
              message: dane.message,
              country: dane.country,
              alojamiento: dane.alonum
            })
            this.AloNum = dane.alonum;
            this.Alojamiento = dane.alojam;
          } else {
            this.snack.open('Tu reserva fue procesada si lo desas puedes crear nueva', 'Ok', { duration: 5000 })
            localStorage.removeItem('enddate');
            localStorage.removeItem('startdate');
            localStorage.removeItem('email');
            localStorage.removeItem('phone');
            localStorage.removeItem('key');
            this.autsrv.LogOut();
            this.router.navigateByUrl('offer');

          }
        })
        this.Modificator = true;
      });
    } else {
      this.snack.open('Los campos con (*) son obligatorios', 'Ok', { duration: 5000 })
    }
  }
  editInServer(): void {
    const checkkey = localStorage.getItem('key');
    if (this.reform.valid) {
      update(refdb(this.rdb, 'reservas/' + checkkey), this.FormData(false)).then((rs) => {
        this.dialog.open(BoodocComponent, { disableClose: true, })
      }).catch((err) => {
        console.log(err);
      }).then(() => {
        this.reform.reset();
        this.router.navigateByUrl('events')
      })
      // else {
      //     const snkfd = this.snack.open('Cambia algun dato si lo deseas o descubre eventos que hemos preparado', 'Ok',
      //      { verticalPosition: 'top', horizontalPosition: 'right' });

      //   }
    }

  }
  FormData(isNewRecord: boolean) {
    const fromdate = localStorage.getItem('startdate')
    const todate = localStorage.getItem('enddate')
    const hoy = new Date();
    const checkin = Number(fromdate);
    const checkout = Number(todate);
    const adddate = hoy.getUTCFullYear() + '' + (hoy.getMonth() + 1) + '' + hoy.getDate() + '' + hoy.getHours() + '' + hoy.getMinutes();
    const reres = 'OF-' + this.Adults + '+' + this.Child + '-A-' + this.AloNum + '-' + adddate;
    const data: { [key: string]: string | number } = {
      noreserva: reres,
      fullname: this.reform.controls.fullname.value || '',
      email: this.reform.controls.email.value || '',
      phone: this.reform.controls.phone.value || '',
      message: this.reform.controls.message.value || '',
      country: this.reform.controls.country.value || '',
      checkin: checkin,
      checkout: checkout,
      daystostay: this.countdays,
      adults: this.Adults,
      children: this.Child,
      pricetopay: this.ToPay(),
      alojam: this.Alojamiento || '',
      alonum: this.AloNum,
    }
    if (isNewRecord == true) {
      data['createdAt'] = new Date().getTime();
    } else {
      data['modifiedAt'] = new Date().getTime();
    }
    localStorage.setItem('email', data['email'].toString());
    localStorage.setItem('phone', data['phone'].toString());
    return data;
  }

  cancel(): void {
    this.router.navigateByUrl('/');
  }

  backToOffer(): void {
    this.router.navigateByUrl('/offer');
  }
}

@Component({
  selector: 'app-msg',
  templateUrl: 'message.html'
})
export class SnackMsg {
  snackBarRef = inject(MatSnackBarRef);
}


