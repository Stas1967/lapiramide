import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministratorComponent } from './administrator.component';
import { ImagelistComponent } from './imagelist/imagelist.component';
import { ApartmentsComponent } from './apartments/apartments.component';
import { EventsComponent } from './events/events.component';
import { UsersComponent } from './users/users.component';
import { BookinglistComponent } from './bookinglist/bookinglist.component';
import { CardimgComponent } from './cardimg/cardimg.component';

const routes: Routes = [
  {
    path: '', component: AdministratorComponent, children: [
      { path: '', redirectTo: 'apartments', pathMatch: 'full' },
      { path: 'apartments', title: 'Administrator - Apartamentos', component: ApartmentsComponent },
      { path: 'events', title: 'Administrator - Eventos', component: EventsComponent },
      { path: 'imagelist', title: 'Administrator - Image list', component: ImagelistComponent },
      { path: 'users', title: 'Administrator - Usuarios', component: UsersComponent },
      { path: 'bookinglist', title: 'Administrator - Reservas', component: BookinglistComponent }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
