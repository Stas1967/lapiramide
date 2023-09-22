import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';


import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
//import { AutentService } from '../../services/autent.service';
import { ImgPanel } from '../classes/imginfo';
import { LowstringPipe } from '../classes/lowstring.pipe';
import { fireStorage } from 'src/app/app.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export interface DialogData {
  dialogicon: string;
  dialogtitle: string
  dialogtxt: string;
  dialogpromis: string;
  show: boolean;
  logreg: boolean;
}

@Component({
  selector: 'lib-cardimg',
  templateUrl: './cardimg.component.html',
  styleUrls: ['./cardimg.component.css'],
  providers: [
    LowstringPipe,
  ]
})
export class CardimgComponent {
  storage = fireStorage;
  iceCardCard: Event | undefined;
  iceCardFull: Event | undefined;
  imageChangedEventCard: any = '';
  imageChangedEventFull: any = '';
  croppedImageCard: any = '';
  croppedImageFull: any = '';
  readerCard = new FileReader();
  readerFull = new FileReader();
  base64DataCard = '';
  base64DataFull = '';
  public imagePathCard: any;
  public imagePathFull: any;
  newImgNameCard: string = '';
  newImgNameFull: string = '';
  nFileCard: File | undefined;
  nFileFull: File | undefined;
  @Input() imgLink: string | undefined;
  @Input() imgWidthCard: number = 280;
  @Input() imgWidthFull: number = 1920;
  @Input() imgAspRatioCard: number = 1;
  @Input() imgAspRatioFull: number = 16 / 9;
  @Output() imgurlCard = new EventEmitter<string>();
  @Output() imgurlFull = new EventEmitter<string>();
  @Output() closepanel = new EventEmitter<ImgPanel>();

  constructor(private low: LowstringPipe, public dialogRef: MatDialogRef<CardimgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,) { }

  fileChangeEvent(event: Event): void {
    this.imageChangedEventCard = event;
    this.imageChangedEventFull = event;
    const koC = this.imageChangedEventCard.target as HTMLInputElement;
    const koF = this.imageChangedEventFull.target as HTMLInputElement;
    const kuC = koC.files![0];
    const kuF = koC.files![0];
    const forimgnameC = kuC.name.split('.').slice(0, -1).join('.');
    const forimgnameF = kuF.name.split('.').slice(0, -1).join('.');
    this.newImgNameCard = this.low.transform(forimgnameC);
    this.newImgNameFull = this.low.transform(forimgnameF);
  }
  dataURLtoFile(dataurl: any, filename: any) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImageCard = event.base64;
    this.croppedImageFull = event.base64;
    if (event.base64) {
      fetch(event.base64).then(res => res.blob()).then((mBlob) => {
        this.readerCard.readAsDataURL(mBlob);
        this.readerFull.readAsDataURL(mBlob);
      });
      const widthC = this.imgWidthCard;
      const widthF = this.imgWidthFull;
      this.readerCard.onload = (ev: ProgressEvent) => {
        const imgC = new Image();
        const imgF = new Image();
        const myFileC = (ev.target as FileReader).result;
        const myFileF = (ev.target as FileReader).result;
        if (myFileC != null) {
          imgC.src = myFileC.toString();
        }
        if (myFileF != null) {
          imgF.src = myFileF.toString();
        }
        imgC.onload = () => {
          const canvasC = document.createElement('canvas');
          const scaleFactC = widthC / imgC.width;
          canvasC.width = widthC;
          canvasC.height = imgC.height * scaleFactC;
          const ctxC = canvasC.getContext('2d');
          if (ctxC != null) {
            ctxC.drawImage(imgC, 0, 0, widthC, canvasC.height);
          }
          this.base64DataCard = canvasC.toDataURL('image/jpeg', 0.8);
          const gyuC = this.dataURLtoFile(this.base64DataCard, 'temp.jpeg')
          this.nFileCard = gyuC;
        };
        imgF.onload = () => {
          const canvasF = document.createElement('canvas');
          const scaleFactF = widthF / imgF.width;
          canvasF.width = widthF;
          canvasF.height = imgF.height * scaleFactF;
          const ctxF = canvasF.getContext('2d');
          if (ctxF != null) {
            ctxF.drawImage(imgF, 0, 0, widthF, canvasF.height);
          }
          this.base64DataFull = canvasF.toDataURL('image/jpeg', 0.8);
          const gyuF = this.dataURLtoFile(this.base64DataFull, 'temp.jpeg')
          this.nFileFull = gyuF;
        };
      };
    }
  }

  send(): void {
    let storagelink = '';
    // this.authsrv.isSimpleUser().then((ko) => {
    //   storagelink = ko.accountType + '/' + ko.id + '/'
    //   const blob = new Blob([this.nFile!], { type: this.nFile?.type })
    //   //const filename = storagelink + '/' + `${new Date().getTime()}_${Math.floor(Math.random() * 1000000)}.jpeg`;
    //   const filename = storagelink + '/' + this.newImgName + '_' + this.imgCode + '.jpeg';
    //   const fileRef = ref(this.storage, filename);
    //   const metadata = {
    //     cacheControl: 'public, max-age=604800',
    //     contentType: 'image/jpeg'
    //   }
    //   const uploadTask = uploadBytes(fileRef, blob, metadata).then((snapshot) => {
    //     getDownloadURL(snapshot.ref).then((url) => {
    //       this.imgurl.emit(url);
    //       this.closepanel.emit({ close: false, info: this.imgCode });
    //     });
    //   });
    // })
  }
}

