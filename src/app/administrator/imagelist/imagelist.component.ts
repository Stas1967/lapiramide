import { Component } from '@angular/core';
import { ImgPanel } from '../classes/imginfo';
import { BehavService } from 'src/app/services/behav.service';
import { MatDialog } from '@angular/material/dialog';
import { CardimgComponent } from '../cardimg/cardimg.component';
import { DatabaseService, ListaImg } from 'src/app/services/database.service';

@Component({
  selector: 'app-imagelist',
  templateUrl: './imagelist.component.html',
  styleUrls: ['./imagelist.component.css'],
})
export class ImagelistComponent {
  addImagePanel: boolean = false;
  imageList: ListaImg[] = [];
  tempimglist: ListaImg[] = []
  mini = '';
  big = '';
  isok = '';

  constructor(public bhsrv: BehavService, public dialog: MatDialog, public dbsrv: DatabaseService) { }

  ngOnInit(): void {
    this.imageList.length = 0;
    this.imageList = [];
    this.imageList = this.dbsrv.getImageList();
  }

  openImage(): void {
    const dialogref = this.dialog.open(CardimgComponent, { data: { mini: this.mini, isok: this.isok } })
    dialogref.afterClosed().subscribe((dane) => {
      if (dane !== 'Cancel') {
        this.imageList.push(dane);
      }
    })
  }
  closeImagePanel(event: ImgPanel) {
    this.addImagePanel = event.close;
  }
}
