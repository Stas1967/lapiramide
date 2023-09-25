import { Component } from '@angular/core';
import { ImgPanel } from '../classes/imginfo';
import { BehavService } from 'src/app/services/behav.service';
import { MatDialog } from '@angular/material/dialog';
import { CardimgComponent } from '../cardimg/cardimg.component';
import { DatabaseService, ListaImg } from 'src/app/services/database.service';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-imagelist',
  templateUrl: './imagelist.component.html',
  styleUrls: ['./imagelist.component.css'],
})
export class ImagelistComponent {
  addImagePanel: boolean = false;
  imageList: BehaviorSubject<ListaImg[]> | undefined;
  tempimglist: ListaImg[] = []
  mini = '';
  big = '';
  isok = '';
  dataSource!: MatTableDataSource<any>;
  constructor(public bhsrv: BehavService, public dialog: MatDialog, public dbsrv: DatabaseService) { }

  ngOnInit(): void {
    this.tempimglist = this.dbsrv.getImageList();
    this.dataSource = new MatTableDataSource<any>(this.tempimglist);
    this.imageList = this.dataSource.connect();
  }

  openImage(): void {
    const dialogref = this.dialog.open(CardimgComponent, { data: { mini: this.mini, isok: this.isok } })
    dialogref.afterClosed().subscribe((dane) => {
      if (dane !== 'Cancel') {
        this.tempimglist.push(dane);
      }
    })
  }
  closeImagePanel(event: ImgPanel) {
    this.addImagePanel = event.close;
  }
}
