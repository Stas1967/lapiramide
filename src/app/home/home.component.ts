import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehavService } from '../services/behav.service';
import { BookinghomeComponent } from '../bookinghome/bookinghome.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BookinghomeComponent, DragDropModule, MatIconModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isSmall: boolean;
  datestart: Date;
  dateend: Date;

  constructor(public bhvsrv: BehavService,) {
    this.isSmall = bhvsrv.isMobilFu();
    this.datestart = this.bhvsrv.getDate().start;
    this.dateend = this.bhvsrv.getDate().end;
  }

  @HostListener('window:resize', ['$event'])
  ngOnResize() {
    this.isSmall = this.bhvsrv.isMobilFu();

  }
}
