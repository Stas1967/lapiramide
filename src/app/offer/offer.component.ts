import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BehavService } from '../services/behav.service';
import { BookinghomeComponent } from '../bookinghome/bookinghome.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule, BookinghomeComponent, MatCardModule, MatButtonModule,
    MatIconModule, MatExpansionModule],
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent {
  isSmall: boolean;
  datestart: Date;
  dateend: Date;
  countdays: number;
  constructor(public router: Router, public bhvsrv: BehavService,) {
    this.isSmall = bhvsrv.isMobilFu();
    this.datestart = bhvsrv.getDate().start
    this.dateend = bhvsrv.getDate().end;
    this.countdays = bhvsrv.getDate().countdays;
  }

  countDays(event: number) {
    this.countdays = event;
  }

  @HostListener('window:resize', ['$event'])
  ngOnResize() {
    this.isSmall = this.bhvsrv.isMobilFu();
  }
}
