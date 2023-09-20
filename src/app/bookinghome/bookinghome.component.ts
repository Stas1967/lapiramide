import { Component, EventEmitter, Inject, Input, Output, ViewEncapsulation, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatDateRangeSelectionStrategy, DateRange, MAT_DATE_RANGE_SELECTION_STRATEGY, MatDatepickerModule } from '@angular/material/datepicker';
// Material Form
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehavService } from '../services/behav.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
@Injectable()
export class FiveDayRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>) { }

  selectionFinished(date: D | null): DateRange<D> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, 0);
      const end = this._dateAdapter.addCalendarDays(date, 5);
      return new DateRange<D>(start, end);
    }
    return new DateRange<D>(null, null);
  }
}

@Component({
  selector: 'app-bookinghome',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatDatepickerModule,
    ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatInputModule,
    MatNativeDateModule, MatRippleModule,
    MatButtonModule, MatIconModule, MatCardModule],

  templateUrl: './bookinghome.component.html',
  styleUrls: ['./bookinghome.component.css'],
})
export class BookinghomeComponent {
  today = new Date();
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  @Input() btnVisible = true;
  startDate: Date | undefined;
  endDate: Date | undefined;

  @Output() ileDni = new EventEmitter<number>()

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const day = cellDate.getDay();
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
    let startDate = this.range.controls.start.value?.getTime() || new Date(new Date().setDate(new Date().getDate() + 1)).getTime();
    if (endDate > startDate) {
      let diffInMs = Math.abs(endDate - startDate);
      let diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      localStorage.setItem('startdate', startDate.toString() || '')
      localStorage.setItem('enddate', endDate.toString() || '')
      this.ileDni.emit(diffInDays)
      return Math.round(diffInDays);
    } else if (endDate === startDate) {
      return 0;
    }
    return -1;
  }
  goToOffer() {
    if (this.getSelectedDays() === 0) {
      const wrd = this.dialog.open(WrongDialog)
      wrd.afterClosed().subscribe((d) => {
        if (d === 'true') {
          console.log('ewrewrrty');
          this.range.setValue({
            start: this.bhvsrv.getDate().start,
            end: this.bhvsrv.getDate().end
          })
        }
      })
    } else {
      this.route.navigateByUrl('/offer');
    }
    // if (this.getSelectedDays() === 0) {
    //   if (confirm('Selecione dos fechas consecutivas')) {
    //     this.range.setValue({
    //       start: this.bhvsrv.getDate().start,
    //       end: this.bhvsrv.getDate().end
    //     })
    //   } else {
    //     this.range.setValue({
    //       start: new Date(),
    //       end: new Date(new Date().setDate(new Date().getDate() + 1))
    //     })
    //   }
    // } else if (this.getSelectedDays() === -1) {
    //   this.route.navigateByUrl('/offer');
    // } else {
    //   this.route.navigateByUrl('/offer');
    // }

  }
  constructor(private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string,
    public bhvsrv: BehavService, public route: Router, public dialog: MatDialog) {
    const lang = window.navigator.language;
    _adapter.setLocale(lang)
  }

  ngOnInit(): void {
    this.range.setValue({
      start: this.bhvsrv.getDate().start,
      end: this.bhvsrv.getDate().end
    })
  }
}




@Component({
  selector: 'app-wrongdate',
  templateUrl: './wrongdate.html',
})
export class WrongDialog {


  constructor(
    public dialogRef: MatDialogRef<WrongDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }
}

export interface DialogData {
  dialogicon: string;
  dialogtitle: string
  dialogtxt: string;
  dialogpromis: string;
  show: boolean;
  logreg: boolean;
}
