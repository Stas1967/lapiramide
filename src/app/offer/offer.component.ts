import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent {
  constructor(public router: Router) {
    const dateA = parseInt(localStorage.getItem('startdate') || '')
    const date = new Date(dateA)
    console.log(date.getDate());
  }
}
