import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehavService } from '../services/behav.service';

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent {
  isSmall: boolean;
  constructor(public bhvsrv: BehavService,) {
    this.isSmall = bhvsrv.isMobilFu();
  }
  @HostListener('window:resize', ['$event'])
  ngOnResize() {
    this.isSmall = this.bhvsrv.isMobilFu();
  }
}
