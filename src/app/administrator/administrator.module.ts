import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { UsersComponent } from './users/users.component';
import { BookinglistComponent } from './bookinglist/bookinglist.component';


@NgModule({
  declarations: [
    AdministratorComponent,
    ImagelistComponent,
    ApartmentsComponent,
    EventsComponent,
    UsersComponent,
    BookinglistComponent
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
    FootComponent
  ]
})
export class AdministratorModule { }
