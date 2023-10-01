import { Component, ViewChild } from '@angular/core';
import { fireRdb, refdb } from '../app.module';
import { onValue } from 'firebase/database';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-boodoc',
  templateUrl: './boodoc.component.html',
  styleUrls: ['./boodoc.component.css']
})


export class BoodocComponent {
  rdb = fireRdb;
  docu: { [key: string]: string | number } = {};
  mimage = '';
  @ViewChild('mydiv') mydiv: HTMLDivElement | undefined;
  @ViewChild('divimg') img: HTMLDivElement | undefined;
  @ViewChild('mimg') mimg: HTMLImageElement | undefined;
  getDBookData(): void {
    const checkkey = localStorage.getItem('key');
    onValue(refdb(this.rdb, 'reservas/' + checkkey), (snap) => {
      if (snap.exists()) {
        const dane = snap.val();
        this.docu = dane;
      }
    }, { onlyOnce: true })
    setTimeout(() => {
      const element = document.getElementById('mydiv');
      if (element) {
        html2canvas(element).then(canvas => {
          const MiCanva = document.createElement('dimig').appendChild(canvas)
          this.mimage = MiCanva.toDataURL('image/png', 0.8)

        });
      }
    }, 500)
  }
  saveAsImage(): void {
    const blobData = this.convertBase64ToBlob(this.mimage);
    const blob = new Blob([blobData], { type: 'image/png' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Mi Reserva';
    link.click();
  }
  ngOnInit(): void {
    this.getDBookData();
  }

  private convertBase64ToBlob(Base64Image: any): any {
    // SPLIT INTO TWO PARTS
    const parts = Base64Image.split(';base64,');
    // HOLD THE CONTENT TYPE
    const imageType = parts[0].split(':')[1];
    // DECODE BASE64 STRING
    const decodedData = window.atob(parts[1]);
    // CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH
    const uInt8Array = new Uint8Array(decodedData.length);
    // INSERT ALL CHARACTER CODE INTO UINT8ARRAY
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // RETURN BLOB IMAGE AFTER CONVERSION
    return new Blob([uInt8Array], { type: imageType });
  }
}
