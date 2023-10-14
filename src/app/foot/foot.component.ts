import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-foot',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './foot.component.html',
  styleUrls: ['./foot.component.css']
})
export class FootComponent {
  today = new Date();
}
