import { Component, } from '@angular/core';

import { uploadString, ref, getDownloadURL } from 'firebase/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { fireStorage } from 'src/app/app.module';
import { BehavService } from 'src/app/services/behav.service';


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

})
export class CardimgComponent {
  storage = fireStorage;
  iceCard: Event | undefined;
  iceFull: Event | undefined;
  croppedImageCard: any = '';
  croppedImageFull: any = '';
  blobImageCard: string;
  blobImageFull: string;
  constructor(public bhvsrv: BehavService) {
    this.blobImageCard = '';
    this.blobImageFull = '';
  }
  ngOnInit(): void {

  }

  async fileChange(event: Event) {
    this.bhvsrv.passSpin(true);
    this.iceCard = event;
    this.iceFull = event;
    this.bhvsrv.passSpin(false);
    // const ko = this.iceCard.target as HTMLInputElement;
    // const ku = ko.files![0];
    // const imgUrl = URL.createObjectURL(ku);
    // const response = await fetch(imgUrl);
    // const blob = await response.blob();
    // const reader = new FileReader();
    // // Definir qué hacer cuando la lectura se complete
    // reader.onloadend = function () {
    //   //console.log(reader.result);
    // }
    // // Leer el Blob como una cadena Base64
    // reader.readAsDataURL(blob);

  }

  imageCroppedCard = async (event: ImageCroppedEvent): Promise<void> => {
    this.croppedImageCard = (event.objectUrl || '');
    const response = await fetch(this.croppedImageCard);
    const blob = await response.blob();
    const reader = new FileReader();
    // Definir qué hacer cuando la lectura se complete
    const width = 280;
    reader.onloadend = () => {
      const img = new Image();
      const myFile = reader.result;
      if (myFile != null) {
        img.src = myFile.toString();
      }
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleFact = width / img.width;
        canvas.width = width;
        canvas.height = img.height * scaleFact;
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.drawImage(img, 0, 0, width, canvas.height);
        }
        this.blobImageCard = canvas.toDataURL('image/jpeg', 0.8);
      };
    }
    reader.readAsDataURL(blob);
  }

  imageCroppedFull = async (event: ImageCroppedEvent): Promise<void> => {
    this.croppedImageFull = (event.objectUrl || '');
    const response = await fetch(this.croppedImageFull);
    const blob = await response.blob();
    const reader = new FileReader();
    // Definir qué hacer cuando la lectura se complete
    const width = 1920;
    reader.onloadend = () => {
      const img = new Image();
      const myFile = reader.result;
      if (myFile != null) {
        img.src = myFile.toString();
      }
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleFact = width / img.width;
        canvas.width = width;
        canvas.height = img.height * scaleFact;
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.drawImage(img, 0, 0, width, canvas.height);
        }
        this.blobImageFull = canvas.toDataURL('image/jpeg', 0.8);
      };
    }
    reader.readAsDataURL(blob);
  }

  upload() {
    const filePathCard = 'lapiramide/' + 'mini/';
    const filePathFull = 'lapiramide/' + 'full/';
    const imgnameCard = 'nowy2' + '.jpeg';
    const imgnameFull = 'nowy2' + '.jpeg';
    const storageRefCard = ref(this.storage, filePathCard + '/' + imgnameCard)
    const storageRefFull = ref(this.storage, filePathFull + '/' + imgnameFull)
    const metadata = {
      cacheControl: 'public, max-age=604800',
      contentType: 'image/jpeg'
    }
    this.bhvsrv.passSpin(true);
    const uploadTask = uploadString(storageRefCard, this.blobImageCard, 'data_url', metadata).then(() => {
      uploadString(storageRefFull, this.blobImageFull, 'data_url', metadata)
    }).then(() => {
      setTimeout(() => {
        this.bhvsrv.passSpin(false);
      }, 500)
    });;

  }
}



