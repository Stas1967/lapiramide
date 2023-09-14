import { Component, HostListener } from '@angular/core';
import { BehavService } from '../services/behav.service';

@Component({
  selector: 'app-home',
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
