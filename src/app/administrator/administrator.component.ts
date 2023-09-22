import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { BehavService } from '../services/behav.service';
import { NavigationStart, Router, RouterEvent } from '@angular/router';

export interface Section {
  id: number;
  name: string;
  updated: Date;
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
  @ViewChild('blognav', { static: false }) public blognav: MatSidenav | undefined;
  @ViewChild('blogcont', { static: false }) public blogcont: MatSidenavContent | undefined;
  general: Section[] = [
    { id: 0, name: 'Apartamentos', icon: 'apartment', updated: new Date('07/20/2023'), link: 'apartments', disabled: false, dbid: '' },
    { id: 1, name: 'Image list', icon: 'photo_library', updated: new Date('07/20/2023'), link: 'imagelist', disabled: false, dbid: '' },
    { id: 2, name: 'Eventos', icon: 'event', updated: new Date('07/22/2023'), link: 'events', disabled: false, dbid: '' },
    { id: 3, name: 'Usuarios', icon: 'account_circle', updated: new Date('07/23/2023'), link: 'users', disabled: false, dbid: '' }
  ]
  chart: Section[] = [
    { id: 3, name: 'Lista de reservas', icon: 'book_online', updated: new Date('07/23/2023'), link: 'bookinglist', disabled: false, dbid: '' }
  ]
  constructor(public bhvsrv: BehavService, public router: Router) {
    this.isSmall = bhvsrv.isMobilFu();
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

  // isActiveChange(g: Section, event: any) {
  //   const lista = this.getLinkList()
  //   const curIndex = lista.indexOf(g);
  //   if (event == true) {
  //     if (curIndex != 0) {
  //       const prevIndex = (curIndex - 1) % lista.length;
  //       const prevLink = lista[prevIndex]
  //       this.prevURL = prevLink.link;
  //       this.prevLinkTxt = prevLink.name;
  //     }
  //     if (curIndex == 0) {
  //       this.backDisable = true;
  //     } else {
  //       this.backDisable = false;
  //     }
  //     //const curLink = lista[curIndex];
  //     const nextindx = (curIndex + 1) % lista.length;
  //     const nextLink = lista[nextindx];
  //     this.nextLinkTxt = nextLink.name;
  //     this.nextURL = nextLink.link;
  //     this.subpagelink = nextLink.dbid;
  //   }
  // }
}
