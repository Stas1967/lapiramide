import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withInMemoryScrolling } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [

  { path: '', title: 'Aparatamentos La Pirámide - Home', loadComponent: () => import('./home/home.component').then(c => c.HomeComponent) },
  { path: 'about', title: 'Apartamentos La Pirámide - About', loadComponent: () => import('./about/about.component').then(c => c.AboutComponent) },
  { path: 'events', title: 'Apartamentos La Pirámide - Eventos', loadComponent: () => import('./events/events.component').then(c => c.EventsComponent) },
  { path: 'offer', title: 'Apartamentos La Pirámide - Oferta', loadComponent: () => import('./offer/offer.component').then(c => c.OfferComponent) },
  { path: 'login', title: 'Apartamentos La Pirámide - Login', loadComponent: () => import('./login/login.component').then(c => c.LoginComponent) },
  { path: 'register', title: 'Aparatamentos La Pirámide - Registro', loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent) },
  { path: 'administrator', title: 'Apartamentos La Pirámide- Admin', loadChildren: () => import('./administrator/administrator.module').then(m => m.AdministratorModule), canActivate: [AuthGuard] },
  { path: '**', loadComponent: () => import('./home/home.component').then(c => c.HomeComponent) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule],
  providers: [
    provideRouter(routes, withInMemoryScrolling()),
  ]
})
export class AppRoutingModule { }
