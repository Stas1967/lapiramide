import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { BehavService } from '../services/behav.service';
import { BookinghomeComponent } from '../bookinghome/bookinghome.component';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, BookinghomeComponent,
    MatIconModule, MatSelectModule, MatDialogModule, MatButtonModule, MatTableModule,
    MatSnackBarModule, MatRadioModule, RouterModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent {
  isSmall: boolean;
  countdays = 0;
  constructor(public router: Router, public bhvsrv: BehavService,) {
    this.isSmall = bhvsrv.isMobilFu();
    // this.datestart = bhvsrv.getDate().start
    // this.dateend = bhvsrv.getDate().end;
    this.countdays = bhvsrv.getDate().countdays;
  }

  countDays(event: number) {
    this.countdays = event;
  }
}
