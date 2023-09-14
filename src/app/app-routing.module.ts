import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter, withInMemoryScrolling } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', title: 'Aparatamentos La Pirámide - Home', component: HomeComponent, },
  { path: 'about', title: 'Apartamentos La Pirámide- About', loadComponent: () => import('./about/about.component').then(c => c.AboutComponent) },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule],
  providers: [
    provideRouter(routes, withInMemoryScrolling()),
  ]
})
export class AppRoutingModule { }
