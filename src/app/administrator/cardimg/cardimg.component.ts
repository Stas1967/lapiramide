import { Component, Inject, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { push } from 'firebase/database';

import { uploadString, ref, getDownloadURL } from 'firebase/storage';

import { ImageCroppedEvent } from 'ngx-image-cropper';
import { fireRdb, fireStorage, refdb } from 'src/app/app.module';
import { BehavService } from 'src/app/services/behav.service';

export interface DialogData {
  mini: string;
  big: string;
  alt: string;
  isok: string;
}

@Component({
  selector: 'lib-cardimg',
  templateUrl: './cardimg.component.html',
  styleUrls: ['./cardimg.component.css'],
})
export class CardimgComponent {
  storage = fireStorage;
  realdb = fireRdb;
  iceCard: Event | undefined;
  iceFull: Event | undefined;
  croppedImageCard: any = '';
  croppedImageFull: any = '';
  blobImageCard: string;
  blobImageFull: string;
  imageName = '';
  upldBtn = true;
  mini = '';
  big = '';
  constructor(public bhvsrv: BehavService, public dialogRef: MatDialogRef<CardimgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,) {
    this.blobImageCard = '';
    this.blobImageFull = '';
  }
  ngOnInit(): void {

  }

  onNoClick(): void {
    this.data.isok = 'Cancel';
    this.dialogRef.close();

  }

  async fileChange(event: Event) {
    this.iceCard = event;
    this.iceFull = event;
    this.imageName = crypto.randomUUID();
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
    if (this.croppedImageCard) {
      this.upldBtn = false;
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
    } else {
      this.upldBtn = true;
    }
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

  async upload(): Promise<void> {
    if (this.imageName != '') {
      const filePathCard = 'lapiramide/' + 'mini/';
      const filePathFull = 'lapiramide/' + 'full/';
      const imgnameCard = this.imageName + '.jpeg';
      const imgnameFull = this.imageName + '.jpeg';
      const storageRefCard = ref(this.storage, filePathCard + '/' + imgnameCard)
      const storageRefFull = ref(this.storage, filePathFull + '/' + imgnameFull)
      const metadata = {
        cacheControl: 'public, max-age=604800',
        contentType: 'image/jpeg'
      }
      this.bhvsrv.passSpin(true);
      //const newKey = push(child(refdb(this.realdb), 'lapiramide')).key
      await uploadString(storageRefCard, this.blobImageCard, 'data_url', metadata).then(() => {
        getDownloadURL(storageRefCard).then((curl) => {
          this.mini = curl
          this.data.mini = curl;
          this.data.isok = 'Ok'
        })
      }).then(async () => {
        await uploadString(storageRefFull, this.blobImageFull, 'data_url', metadata).then(() => {
          getDownloadURL(storageRefFull).then((furl) => {
            this.big = furl;
            this.data.big = furl;
          }).then(() => {
            push(refdb(this.realdb, 'lapiramide/'), {
              mini: this.mini,
              big: this.big,
              alt: 'Apartamentos La Piramide',
            })
          })
        })
      }).finally(() => {
        this.upldBtn = false;
        this.bhvsrv.passSpin(false);
        this.dialogRef.close();
      })
    }
  }
}



