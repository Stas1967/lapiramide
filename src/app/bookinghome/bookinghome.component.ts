import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
// Material Form
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehavService } from '../services/behav.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bookinghome',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatDatepickerModule,
    ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatInputModule,
    MatNativeDateModule, MatRippleModule,
    MatButtonModule, MatIconModule],
  templateUrl: './bookinghome.component.html',
  styleUrls: ['./bookinghome.component.css'],
})
export class BookinghomeComponent {
  today = new Date();
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  // dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
  //   if (view === 'month') {
  //     const date = cellDate.getDate();
  //     return date === 1 || date === 6 ? 'example-custom-date-class' : '';
  //   }
  //   return '';
  // };

  // dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
  //   if (view === 'month') {
  //     const day = cellDate.getDay();
  //     // Marcar solo los sábados y domingos.
  //     return day === 6 || day === 0 ? 'sunday-date-class' : '';
  //   }
  //   return '';
  // };

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const day = cellDate.getDay();
      // Marcar los domingos con 'sunday-date-class' y los sábados con 'saturday-date-class'.
      if (day === 0) {
        return 'sunday-date-class';
      } else if (day === 6) {
        return 'sat-date-class';
      }
    }
    return '';
  };

  myFilter = (d: Date | null): boolean => {
    const day = d?.getDay();
    return day !== 6 && day !== 0;
  }

  getSelectedDays = (): number => {
    let endDate = this.range.controls.end.value?.getTime() || new Date().getTime();
    let startDate = this.range.controls.start.value?.getTime() || new Date().getTime();
    if (endDate > startDate) {
      let diffInMs = Math.abs(endDate - startDate);
      let diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      localStorage.setItem('startdate', this.range.controls.start.value?.getTime().toString() || '')
      localStorage.setItem('enddate', this.range.controls.end.value?.getTime().toString() || '')
      return Math.round(diffInDays);
    }
    return 0;
  }
  goToOffer() {
    this.route.navigateByUrl('/offer')
  }
  constructor(private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string, public bhvsrv: BehavService, public route: Router) {
    const lang = window.navigator.language;
    _adapter.setLocale(lang)
  }
}
