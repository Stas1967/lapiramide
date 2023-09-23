import { Component, HostListener, ViewChild, } from '@angular/core';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { BehavService } from './services/behav.service';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { AutentService } from './services/autent.service';
import { fireAuth } from './app.module';
import { onAuthStateChanged, signOut } from 'firebase/auth';
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
  title = 'Apartamentos La Piramide';
  isSmall: boolean;
  isTabl: boolean;
  state = 'hide';
  menuindex = 0;
  spinner = false;
  loggedin: boolean;
  auth = fireAuth;
  @ViewChild('sidenav', { static: false }) public sidenav: MatSidenav | undefined;
  @ViewChild('sidecont', { static: false }) public sidecont: MatSidenavContent | undefined;

  links: myRoute[] = [
    { icon: 'home', name: 'Inicio', url: '/' },
    { icon: 'celebration', name: 'Eventos', url: '/events' },
  ];
  linkssm: myRoute[] = [
    { icon: 'home', name: 'Inicio', url: '/' },
    { icon: 'shop', name: 'Ofertas', url: '/offer' },
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
    const auth = fireAuth;
    this.router.navigateByUrl('/');
    this.loggedin = false;
    return signOut(auth);
  }

  ngOnInit() {
    console.log(this.bhvsrv.isSpinerOn());

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
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
