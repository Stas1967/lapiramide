import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentSingleTabManager } from 'firebase/firestore';
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
import '@angular/common/locales/global/es';
import '@angular/common/locales/es';
import { MAT_DATE_LOCALE } from '@angular/material/core';

const firebaseConfig = {
  apiKey: "AIzaSyAsuvgLiqYqpGnG0-msCc7c9kdOIDkpMXg",
  authDomain: "aparthotellapiramide.firebaseapp.com",
  databaseURL: "https://aparthotellapiramide-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "aparthotellapiramide",
  storageBucket: "aparthotellapiramide.appspot.com",
  messagingSenderId: "898011423719",
  appId: "1:898011423719:web:4b0b980da2aabda56d1342",
  measurementId: "G-JEMSNSLHY7"
};

// const firebaseConfig = {
//   //apiKey: "",
//   apiKey: "AIzaSyBVWxsXq5YLJlhUReBqdO8Q4t74b77cZl8",
//   authDomain: "lapiramide-544e8.firebaseapp.com",
//   databaseURL: "https://lapiramide-544e8-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "lapiramide-544e8",
//   storageBucket: "lapiramide-544e8.appspot.com",
//   messagingSenderId: "973582638272",
//   appId: "1:973582638272:web:9ae7ce129147d4acaba125",
//   measurementId: "G-90ZQQ1GC83"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentSingleTabManager({}) }) })

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
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
