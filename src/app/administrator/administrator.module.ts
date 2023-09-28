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
import { ImagelistComponent, ImgLink } from './imagelist/imagelist.component';
import { AddNewRoom, RoomImg } from './apartments/apartments.component';

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
import { EditUser, NewUser } from './users/users.component';
import { MatSelectModule } from '@angular/material/select';
import { NewEvent } from './events/events.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [
    AdministratorComponent,
    ImagelistComponent,
    BookinglistComponent,
    CardimgComponent,
    NewUser,
    AddNewRoom,
    RoomImg,
    NewEvent,
    ImgLink,
    EditUser
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
    MatNativeDateModule, MatDatepickerModule,
    NgFor,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatRadioModule
  ]
})
export class AdministratorModule { }
