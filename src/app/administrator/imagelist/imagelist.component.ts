import { Component } from '@angular/core';
import { ImgPanel } from '../classes/imginfo';
import { BehavService } from 'src/app/services/behav.service';
import { MatDialog } from '@angular/material/dialog';
import { CardimgComponent } from '../cardimg/cardimg.component';

@Component({
  selector: 'app-imagelist',
  templateUrl: './imagelist.component.html',
  styleUrls: ['./imagelist.component.css'],
})
export class ImagelistComponent {
  addImagePanel: boolean = false;
  constructor(public bhsrv: BehavService, public dialog: MatDialog) {

  }
  openImage(): void {
    this.dialog.open(CardimgComponent, { width: '100%' }).afterClosed().subscribe((dane) => {
      console.log(dane);
    })
  }


  closeImagePanel(event: ImgPanel) {
    this.addImagePanel = event.close;
  }

}
