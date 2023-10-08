import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withInMemoryScrolling } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [

  { path: '', title: 'Aparatamentos La Pirámide - Home', loadComponent: () => import('./home/home.component').then(c => c.HomeComponent) },
  { path: 'about', title: 'Apartamentos La Pirámide - About', loadComponent: () => import('./aboutus/aboutus.component').then(c => c.AboutusComponent) },
  { path: 'events', title: 'Apartamentos La Pirámide - Eventos', loadComponent: () => import('./eventos/eventos.component').then(c => c.EventosComponent) },
  { path: 'offer', title: 'Apartamentos La Pirámide - Oferta', loadComponent: () => import('./offer/offer.component').then(c => c.OfferComponent) },
  { path: 'reserva', title: 'Apartamentos La Pirámide - Reseravs', loadComponent: () => import('./reserva/reserva.component').then(c => c.ReservaComponent) },
  { path: 'login', title: 'Apartamentos La Pirámide - Login', loadComponent: () => import('./login/login.component').then(c => c.LoginComponent) },
  { path: 'register', title: 'Aparatamentos La Pirámide - Registro', loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent) },
  { path: 'administrator', title: 'Apartamentos La Pirámide- Admin', loadChildren: () => import('./administrator/administrator.module').then(m => m.AdministratorModule), canActivate: [AuthGuard] },
  { path: '**', loadComponent: () => import('./pagenotfound/pagenotfound.component').then(c => c.PagenotfoundComponent) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule],
  providers: [
    provideRouter(routes, withInMemoryScrolling()),
  ]
})
export class AppRoutingModule { }
