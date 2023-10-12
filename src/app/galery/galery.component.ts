import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fireRdb } from '../app.module';
import { DatabaseService, ListaImg } from '../services/database.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BehavService } from '../services/behav.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SlideshowComponent } from './slideshow/slideshow.component';

@Component({
  selector: 'app-galery',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, SlideshowComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './galery.component.html',
  styleUrls: ['./galery.component.css']
})
export class GaleryComponent {
  rdb = fireRdb;

  tempimglist: ListaImg[] = []
  mini = '';
  big = '';
  ImgSlideShow = false
  slideIndex = 0;
  constructor(public bhsrv: BehavService, public dialog: MatDialog, public dbsrv: DatabaseService) { }
  ngOnInit(): void {
    this.tempimglist = this.dbsrv.getImgToGalery();
  }

  showImg(i: number): void {
    this.ImgSlideShow = true;
    this.slideIndex = i

  }

  ClosePanel(event: boolean): void {
    this.ImgSlideShow = event;
  }

}
