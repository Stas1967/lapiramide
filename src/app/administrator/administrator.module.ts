import { NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

import { AdministratorRoutingModule } from './administrator-routing.module';
import { AdministratorComponent } from './administrator.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FootComponent } from '../foot/foot.component';
import { ImagelistComponent } from './imagelist/imagelist.component';
import { ApartmentsComponent } from './apartments/apartments.component';
import { EventsComponent } from './events/events.component';
import { BookinglistComponent } from './bookinglist/bookinglist.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CardimgComponent } from './cardimg/cardimg.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

// Material Form
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NewUser } from './users/users.component';
import { MatSelectModule } from '@angular/material/select';





@NgModule({
  declarations: [
    AdministratorComponent,
    ImagelistComponent,
    ApartmentsComponent,
    EventsComponent,
    BookinglistComponent,
    CardimgComponent,
    NewUser,
  ],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    MatTreeModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    FootComponent,
    ImageCropperModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    FormsModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatDialogModule, MatButtonModule,
    MatSelectModule,
    NgFor
  ]
})
export class AdministratorModule { }
