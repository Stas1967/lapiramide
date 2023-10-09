import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BehavService } from '../services/behav.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-noinvited',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, MatButtonModule],
  templateUrl: './noinvited.component.html',
  styleUrls: ['./noinvited.component.css']
})
export class NoinvitedComponent {
  isSmall: boolean;
  constructor(public bhvsrv: BehavService,) {
    this.isSmall = bhvsrv.isMobilFu();
  }
  @HostListener('window:resize', ['$event'])
  ngOnResize() {
    this.isSmall = this.bhvsrv.isMobilFu();
  }
}
