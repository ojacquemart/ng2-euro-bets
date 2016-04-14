/*
 * Angular 2 decorators and services
 */
import {Component, ViewEncapsulation} from 'angular2/core';
import {RouteConfig, Router} from 'angular2/router';

import {Auth} from './core/services/firebase/auth.service';

import {SidenavLayoutCmp} from './core/components/sidenav-layout/sidenav-layout.component';

import {LoginCmp} from './login/login.component';
import {BetsCmp} from './bets/bets.component';
import {TableCmp} from './table/table.component';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  pipes: [],
  providers: [],
  directives: [LoginCmp, SidenavLayoutCmp],
  styles: [
    require('./app.scss')
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <bets-sidenav-layout *ngIf="authenticated">
      <router-outlet></router-outlet>
    </bets-sidenav-layout>

    <bets-login *ngIf="!authenticated "></bets-login>
  `
})
@RouteConfig([
  {path: '/', name: 'Index', component: BetsCmp, useAsDefault: true},
  {path: '/bets', name: 'Bets', component: BetsCmp},
  {path: '/table', name: 'Table', component: TableCmp}
])
export class App {

  private authenticated:boolean;

  constructor(private auth:Auth) {
  }

  ngOnInit() {
    console.log('app @ ngOnInit');

    this.auth.authenticated$.subscribe(authenticated =>{
      this.authenticated = authenticated;
    });
    this.auth.onAuth();
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
