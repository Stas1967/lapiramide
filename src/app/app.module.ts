import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { CACHE_SIZE_UNLIMITED, getFirestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref } from 'firebase/database';
import { getStorage } from 'firebase/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
// Material Form
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FootComponent } from './foot/foot.component';
//import { LoginComponent, LogDialog } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { LogDialog } from './login/login.component';
import { WrongDialog } from './bookinghome/bookinghome.component';
import { LostData, SnackMsg } from './reserva/reserva.component';
import { BoodocComponent } from './boodoc/boodoc.component';



const firebaseConfig = {
  //apiKey: "",
  apiKey: "AIzaSyBVWxsXq5YLJlhUReBqdO8Q4t74b77cZl8",
  authDomain: "lapiramide-544e8.firebaseapp.com",
  databaseURL: "https://lapiramide-544e8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lapiramide-544e8",
  storageBucket: "lapiramide-544e8.appspot.com",
  messagingSenderId: "973582638272",
  appId: "1:973582638272:web:9ae7ce129147d4acaba125",
  measurementId: "G-90ZQQ1GC83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
initializeFirestore(app, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
export const fireDb = getFirestore(app);
export const fireRdb = getDatabase(app);
export const fireAuth = getAuth(app);
export const fireStorage = getStorage(app);
export const refdb = ref;

@NgModule({
  declarations: [
    AppComponent,
    LogDialog,
    WrongDialog,
    SnackMsg,
    BoodocComponent,
    LostData
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    HttpClientModule,
    FootComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
