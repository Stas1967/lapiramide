import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { ImgPanel } from '../classes/imginfo';
import { BehavService } from 'src/app/services/behav.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CardimgComponent } from '../cardimg/cardimg.component';
import { DatabaseService, ListaImg } from 'src/app/services/database.service';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { update } from 'firebase/database';
import { fireRdb, refdb } from 'src/app/app.module';

@Component({
  selector: 'app-imagelist',
  templateUrl: './imagelist.component.html',
  styleUrls: ['./imagelist.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ImagelistComponent {
  rdb = fireRdb;
  addImagePanel: boolean = false;
  imageList: BehaviorSubject<ListaImg[]> | undefined;
  tempimglist: ListaImg[] = []
  mini = '';
  big = '';
  isok = '';
  dataSource!: MatTableDataSource<any>;
  bigmini = true;
  constructor(public bhsrv: BehavService, public dialog: MatDialog, public dbsrv: DatabaseService) { }

  ngOnInit(): void {
    this.tempimglist = this.dbsrv.getImageList();
    this.dataSource = new MatTableDataSource<any>(this.tempimglist);
    this.imageList = this.dataSource.connect();
  }

  openImage(): void {
    const dialogref = this.dialog.open(CardimgComponent, { disableClose: true, data: { mini: this.mini || '', isok: this.isok } });
    dialogref.afterClosed().subscribe((dane) => {
      if (dane !== 'Cancel') {
        this.tempimglist.push(dane);
      }
    })
  }
  closeImagePanel(event: ImgPanel) {
    this.addImagePanel = event.close;
  }
  openLinkDial(im: ListaImg) {
    this.dialog.open(ImgLink, { width: '100%', disableClose: true, data: { small: im.mini, full: im.big } });
  }

  toGalery(imidi: string, event: MatCheckboxChange): void {
    console.log(imidi, event.checked);
    update(refdb(this.rdb, 'lapiramide/' + imidi), {
      togalery: event.checked
    })
  }

  minibtn(): void {
    this.bigmini = true;
  }
  bigbtn(): void {
    this.bigmini = false;
  }
}

@Component({
  selector: 'dial-imglink',
  templateUrl: './imglinkdial.html',
  styleUrls: ['./imagelist.component.css']
})

export class ImgLink {
  constructor(public dialogRef: MatDialogRef<ImgLink>, @Inject(MAT_DIALOG_DATA) public links: CopyLink,
    public clipboard: Clipboard, private snack: MatSnackBar) { }

  copytoClipboardBig(biginput: any) {
    const hu = this.clipboard.copy(biginput.value)
    if (hu === true) {
      this.snack.open('Link copiado a Clipboard', 'Ok', { duration: 2000 })
    }
  }
  copytoClipboardMini(miniinput: any) {
    const hu = this.clipboard.copy(miniinput.value)
    if (hu === true) {
      this.snack.open('Link copiado a Clipboard', 'Ok', { duration: 2000 })
    }

  }
}

export interface CopyLink {
  small: string,
  full: string
}