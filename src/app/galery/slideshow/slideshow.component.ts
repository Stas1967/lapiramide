import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehavService } from 'src/app/services/behav.service';
import { DatabaseService, ListaImg } from 'src/app/services/database.service';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  standalone: true,
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent {

  tempimglist: ListaImg[] = [];
  @Output() closePanel = new EventEmitter();
  @Input() slideIndex = 0;
  @ViewChildren('mySlides') mySlides: QueryList<ElementRef> | undefined;
  constructor(public bhsrv: BehavService, public dbsrv: DatabaseService, private ren: Renderer2) { }
  ngOnInit(): void {
    this.tempimglist = this.dbsrv.getImgToGalery();
  }

  ngAfterViewInit(): void {
    let firstSlide = this.mySlides?.first;
    if (firstSlide) {
      this.ren.setStyle(firstSlide.nativeElement, 'display', 'block');
    }
  }
  plusSlides() {
    const cuant = this.tempimglist.length;
    this.slideIndex = (this.slideIndex + 1) % cuant;
  }
  ClosePanel(): void {
    this.closePanel.emit(false);
  }
}

