import { Component, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
// Material Form
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehavService } from '../services/behav.service';


@Component({
  selector: 'app-bookinghome',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule,
    ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatInputModule,
    MatNativeDateModule, MatRippleModule,
    MatButtonModule, MatIconModule],
  templateUrl: './bookinghome.component.html',
  styleUrls: ['./bookinghome.component.css'],
})
export class BookinghomeComponent {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string, public bhvsrv: BehavService,) {
    const lang = 'es-ES'; // window.navigator.language;
    _adapter.setLocale(lang)
  }
}
