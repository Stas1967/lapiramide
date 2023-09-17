import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { BehavService } from '../services/behav.service';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent {
  isSmall: boolean;
  isTabl: boolean;
  constructor(public router: Router, public bhvsrv: BehavService,) {
    this.isSmall = bhvsrv.isMobilFu();
    this.isTabl = bhvsrv.isTabletFu();
    const dateA = parseInt(localStorage.getItem('startdate') || '')
    const date = new Date(dateA)
    console.log(date.getDate());
  }

  @HostListener('window:resize', ['$event'])
  ngOnResize() {
    this.isSmall = this.bhvsrv.isMobilFu();
  }
}
