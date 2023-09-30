import { Component, Inject, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BehavService } from '../services/behav.service';
import { BookinghomeComponent } from '../bookinghome/bookinghome.component';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { fireAuth, fireRdb, refdb } from '../app.module';
import { ref, set } from 'firebase/database';
import { signInAnonymously, updateCurrentUser, updateEmail, updateProfile } from 'firebase/auth';

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
  Alojamiento = 'Solo Cama';
  AloNum = 0;
  Modificator = false;
  reform = new FormGroup({
    fullname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required, Validators.pattern('[a-z0-9]{3,}@[a-z]{2,}.[a-z]{2,}')]),
    phone: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    message: new FormControl(''),
  })
  constructor(public router: Router, public bhvsrv: BehavService, public acRoute: ActivatedRoute, private snack: MatSnackBar) {
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
    this.reform.setValue({
      fullname: 'Tomasz Wroblewski',
      email: 'vizaint@gmail.com',
      phone: '682544944',
      message: 'Fajna wiadomosc',
      country: 'Kongo'
    })

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
    const getmail = localStorage.getItem('email')
    if (getmail == this.reform.controls.email.value) { }
    const msnak = this.snack.openFromComponent(SnackMsg, { verticalPosition: 'top', horizontalPosition: 'right' });
    msnak.onAction().subscribe(() => {
      this.Modificator = true;
    });
    const checkkey = localStorage.getItem('key');
    let anouser = ''
    if (localStorage.getItem('key') == null) {
      signInAnonymously(this.auth).then((res) => {

        console.log(res);
        anouser = res.user.uid
        if (checkkey === anouser) {
          console.log('Ya tienes una reserva');
        } else {
          localStorage.setItem('key', res.user.uid)
          set(refdb(this.rdb, 'reservas/' + res.user.uid), this.FormData()).catch((err) => {
            console.log(err);
          })
        }
      })
    } else {
      console.log('Puedes login');
      set(refdb(this.rdb, 'reservas/' + checkkey), this.FormData()).catch((err) => {
        console.log(err);
      })
    }
    //set(refdb(this.rdb, 'reservas/'), data);
  }

  editInServer(): void {

  }

  FormData(): any {
    const fromdate = localStorage.getItem('startdate')
    const todate = localStorage.getItem('enddate')
    const dzis = new Date();
    const checkin = Number(fromdate);
    const chckout = Number(todate);
    const adddate = dzis.getUTCFullYear() + '' + (dzis.getMonth() + 1) + '' + dzis.getDate();
    const reres = 'OF-' + this.Adults + '+' + this.Child + '-A-' + this.AloNum + '-' + adddate;
    const data = {
      noreserva: reres,
      fullname: this.reform.controls.fullname.value,
      email: this.reform.controls.email.value,
      phone: this.reform.controls.phone.value,
      message: this.reform.controls.message.value,
      country: this.reform.controls.country.value,
      checkin: checkin,
      chckout: chckout,
      audlts: this.Adults,
      children: this.Child,
      pricetopay: this.ToPay(),
      alojam: this.Alojamiento,
      createdAt: new Date().getTime(),
    }
    localStorage.setItem('email', data.email || '');
    localStorage.setItem('phone', data.phone || '');
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

