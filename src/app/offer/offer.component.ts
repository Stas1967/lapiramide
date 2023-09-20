import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { BehavService } from '../services/behav.service';
import { BookinghomeComponent } from '../bookinghome/bookinghome.component';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule, BookinghomeComponent],
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent {
  isSmall: boolean;
  datestart: Date;
  dateend: Date;
  constructor(public router: Router, public bhvsrv: BehavService,) {
    this.isSmall = bhvsrv.isMobilFu();
    this.datestart = bhvsrv.getDate().start
    this.dateend = bhvsrv.getDate().end;
  }

  @HostListener('window:resize', ['$event'])
  ngOnResize() {
    this.isSmall = this.bhvsrv.isMobilFu();
  }
}
