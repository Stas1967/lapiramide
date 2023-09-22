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
  imglink = '';
  imgcode: string = '';
  imgwidth: number = 260;
  imgaspratio: number = 1;
  isProfilImg: boolean = false;
  isCardImg: boolean = false;
  isPageImg: boolean = false;
  constructor(public bhsrv: BehavService, public dialog: MatDialog) {

  }
  openImage(): void {
    this.dialog.open(CardimgComponent, { width: '100%' }).afterClosed().subscribe((dane) => {
      console.log(dane);
    })
  }


  closeImagePanel(event: ImgPanel) {
    this.addImagePanel = event.close;
    const oldimg = '../assets/images/noimage.webp';
    // if (this.aeuform.value.photoURL === oldimg) {
    //   this.isProfilImg = true;
    // }
    // if (this.aeuform.value.photocard === oldimg) {
    //   this.isCardImg = true;
    // }
    // if (this.aeuform.value.photopage === oldimg) {
    //   this.isPageImg = true;
    // }
  }

  getImgUrl(imgCode: string, imgurl: string,) {
    //   if (imgCode === 'profil') {
    //     this.aeuform.patchValue({
    //       photoURL: imgurl
    //     })
    //     this.isProfilImg = false;
    //   } else if (imgCode === 'card') {
    //     this.aeuform.patchValue({
    //       photocard: imgurl,
    //     })
    //     this.isCardImg = false;
    //   } else {
    //     // if imgcode = m3
    //     this.aeuform.patchValue({
    //       photopage: imgurl
    //     })
    //     this.isPageImg = false;
    //   }
  }
}
