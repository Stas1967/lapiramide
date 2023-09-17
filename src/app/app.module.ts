import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { CACHE_SIZE_UNLIMITED, getFirestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
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
// Material Form
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
//import { HomeComponent } from './home/home.component';
//import { AboutComponent } from './about/about.component';
import { FootComponent } from './foot/foot.component';
//import { LoginComponent, LogDialog } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE, MatNativeDateModule, MatRippleModule } from '@angular/material/core';


const firebaseConfig = {
  apiKey: "AIzaSyDv6jZQhNN2qMEq4y4tDj3WOVmqs8v5n3c",
  authDomain: "apartamentolapiramide.firebaseapp.com",
  projectId: "apartamentolapiramide",
  storageBucket: "apartamentolapiramide.appspot.com",
  messagingSenderId: "821555455462",
  appId: "1:821555455462:web:b71e6ca92e897f1a562227",
  measurementId: "G-0KXBTDPC3F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
initializeFirestore(app, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
export const fireDb = getFirestore(app);
export const fireRdb = getDatabase(app);
export const fireAuth = getAuth(app);
export const fireStorage = getStorage(app);

@NgModule({
  declarations: [
    AppComponent,

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
    HttpClientModule,
    FootComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
