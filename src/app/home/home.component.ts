import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehavService } from '../services/behav.service';
import { BookinghomeComponent } from '../bookinghome/bookinghome.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BookinghomeComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isSmall: boolean;
  constructor(public bhvsrv: BehavService,) {
    this.isSmall = bhvsrv.isMobilFu();
  }

  @HostListener('window:resize', ['$event'])
  ngOnResize() {
    this.isSmall = this.bhvsrv.isMobilFu();

  }
  ngOnInit() {
  }

}
