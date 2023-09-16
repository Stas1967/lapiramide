import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withInMemoryScrolling } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', title: 'Aparatamentos La Pirámide - Home', loadComponent: () => import('./home/home.component').then(c => c.HomeComponent) },
  { path: 'about', title: 'Apartamentos La Pirámide- About', loadComponent: () => import('./about/about.component').then(c => c.AboutComponent) },
  { path: 'events', title: 'Apartamentos La Pirámide- Eventos', loadComponent: () => import('./events/events.component').then(c => c.EventsComponent) },
  { path: '**', loadComponent: () => import('./home/home.component').then(c => c.HomeComponent) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule],
  providers: [
    provideRouter(routes, withInMemoryScrolling()),
  ]
})
export class AppRoutingModule { }
