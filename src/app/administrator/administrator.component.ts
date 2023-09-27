import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { BehavService } from '../services/behav.service';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';

export interface Section {
  id: number;
  name: string;
  icon: string;
  link: string;
  disabled: boolean;
  dbid: string;
}

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent {
  isSmall: boolean;
  spinner = false;
  @ViewChild('blognav', { static: false }) public blognav: MatSidenav | undefined;
  @ViewChild('blogcont', { static: false }) public blogcont: MatSidenavContent | undefined;
  general: Section[] = [
    { id: 0, name: 'Apartamentos', icon: 'apartment', link: 'apartments', disabled: false, dbid: '' },
    { id: 1, name: 'Imagenes', icon: 'photo_library', link: 'imagelist', disabled: false, dbid: '' },
    { id: 2, name: 'Eventos', icon: 'event', link: 'events', disabled: false, dbid: '' },
    { id: 3, name: 'Usuarios', icon: 'account_circle', link: 'users', disabled: false, dbid: '' }
  ]
  chart: Section[] = [
    { id: 3, name: 'Lista de reservas', icon: 'book_online', link: 'bookinglist', disabled: false, dbid: '' }
  ]
  constructor(public bhvsrv: BehavService, public router: Router) {
    this.isSmall = bhvsrv.isMobilFu();
    router.events.subscribe((navi) => {
      if (navi instanceof NavigationStart) {
        this.spinner = true;
      } else if (navi instanceof NavigationEnd) {
        this.spinner = false;
      }
    })
  }
  @HostListener('window:resize', ['$event'])
  ngOnResize(): void {
    this.isSmall = this.bhvsrv.isMobilFu();
    if (this.isSmall === false) {
      //this.sidenav?.close();
    }
  }
  onActivate(event: RouterEvent) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.blogcont?.getElementRef().nativeElement.scroll({ top: 0, behavior: 'smooth' })
        //document.getElementById('blogcont')?.scrollTo({ top: 0, behavior: 'smooth' })
      }
    });
  }
  getPosition(event: any): void {
    this.bhvsrv.sideNavFu(event);
  }

  getLinkList(): Section[] {
    const arr1: Section[] = [];
    const arr2: Section[] = [];
    for (let index = 0; index < this.general.length; index++) {
      arr1.push(this.general[index]);
    }
    for (let index = 0; index < this.chart.length; index++) {
      arr2.push(this.chart[index]);
    }
    const links = arr1.concat(arr2);
    return links;
  }

  closeNav(): void {
    if (this.isSmall == true) {
      this.blognav?.toggle();
    }
  }
}
