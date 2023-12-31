import { Component, HostListener, ViewChild, } from '@angular/core';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { BehavService } from './services/behav.service';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { AutentService } from './services/autent.service';
import { fireAuth, fireRdb, refdb } from './app.module';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { onValue } from 'firebase/database';
import { Employers } from './administrator/users/users.component';

export interface myRoute {
  icon: string;
  name: string;
  url: string;
}
const style1 = style({
  marginTop: '3px',
  fontSize: '24px'
})
const style2 = style({
  marginTop: '3px',
  fontSize: '24px'
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('antitle', [
      state('show', style1),
      state('hide', style2),
      transition('show => hide', animate('700ms ease-out')),
      transition('hide => show', animate('700ms ease-in'))
    ])
  ]
})
export class AppComponent {
  rdb = fireRdb;
  title = 'Apartamentos La Piramide';
  isSmall: boolean;
  isTabl: boolean;
  state = 'hide';
  menuindex = 0;
  spinner = false;
  loggedin: boolean;
  auth = fireAuth;
  jest = false;
  displName = '';
  isAnonimo = false;
  isAdmin = false;
  rezsize = 0;
  badgehidden = true;
  isBlocked = true;

  @ViewChild('sidenav', { static: false }) public sidenav: MatSidenav | undefined;
  @ViewChild('sidecont', { static: false }) public sidecont: MatSidenavContent | undefined;
  links: myRoute[] = [
    { icon: 'home', name: 'Inicio', url: '/' },
    { icon: 'image', name: 'Galería', url: '/galery' },
    { icon: 'celebration', name: 'Eventos', url: '/events' },


  ];
  linkssm: myRoute[] = [
    { icon: 'home', name: 'Inicio', url: '/' },
    { icon: 'shop', name: 'Ofertas', url: '/offer' },
    { icon: 'image', name: 'Galería', url: '/galery' },
    { icon: 'celebration', name: 'Eventos', url: '/events' },
  ];
  constructor(public bhvsrv: BehavService, public router: Router) {
    this.isSmall = bhvsrv.isMobilFu();
    this.isTabl = bhvsrv.isTabletFu();
    this.loggedin = false;
    router.events.subscribe((navi) => {
      if (navi instanceof NavigationStart) {
        bhvsrv.passSpin(true);
        this.sidenav?.close();
        const yui = this.sidecont?.getElementRef().nativeElement.scroll({ top: 0, behavior: 'smooth' })
      } else if (navi instanceof NavigationEnd) {
        bhvsrv.passSpin(false);
      }
    })
  }
  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHandler(event: any) {
  //   if (event) {
  //     localStorage.removeItem('email');
  //     localStorage.removeItem('phone');
  //   }
  // }
  @HostListener('window:resize', ['$event'])
  ngOnResize() {
    this.isSmall = this.bhvsrv.isMobilFu();
    if (this.isSmall === false) {
      this.sidenav?.close();
    }
    this.isTabl = this.bhvsrv.isTabletFu();
    if (this.isTabl === false) {
      this.sidenav?.close();
    }
  }
  LogOut() {
    this.router.navigateByUrl('/');
    this.loggedin = false;
    this.isAnonimo = false;
    localStorage.removeItem('authkey')
    return signOut(this.auth);
  }
  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        sessionStorage.setItem('uid', user.uid)
        onValue(refdb(this.rdb, 'users/' + user?.uid), (urx) => {
          const dane = urx.val() as Employers
          if (dane.isAdmin == true) {
            onValue(refdb(this.rdb, 'reservas'), (rex) => {
              if (rex.exists()) {
                this.badgehidden = false;
                this.rezsize = rex.size;
              } else {
                this.badgehidden = true;
                this.rezsize = 0;
              }
            })
          }
        })
      }
      if (user?.isAnonymous == true) {
        this.loggedin = false;
        this.isAnonimo = true;
      }
      if (user?.isAnonymous == false) {
        this.loggedin = true;
      } else {
        this.loggedin = false;
      }
    })
    this.onActivate();
    setTimeout(() => {
      this.sidecont?.getElementRef().nativeElement.addEventListener('scroll', () => {
        const scrollTop = this.sidecont?.getElementRef().nativeElement.scrollTop;
        const componentPosition = this.sidecont?.getElementRef().nativeElement.offsetTop || 0;
        const scrollPosition = scrollTop || 0;
        if (scrollPosition >= componentPosition - 100) {
          this.state = 'show';
        }
        if (scrollPosition <= componentPosition) {
          this.state = 'hide';
        }
      });
    }, 500)
  }
  onActivate() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const blurl = event.url.split('/')[1]
        if (blurl == 'blog') {
          this.state = 'show'
        } else {
          this.state = 'hide'
        }
      }
    });

  }
  getPosition(event: any): void {
    this.bhvsrv.sideNavFu(event);
  }
  isActivChang(): void {
    this.bhvsrv.appsideNav(false);
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
