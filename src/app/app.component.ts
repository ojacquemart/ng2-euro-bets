/*
 * Angular 2 decorators and services
 */
import {Component, ViewEncapsulation} from 'angular2/core';
import {RouteConfig, Router} from 'angular2/router';

import {TranslateService} from 'ng2-translate/ng2-translate';
import * as moment from 'moment/moment';

import {Auth} from './core/services/firebase/auth.service';
import {DEFAULT_LANG, UserLang} from './core/services/util/user-lang.helper';
import {SidenavLayoutCmp} from './core/components/sidenav-layout/sidenav-layout.component';

import {LoginCmp} from './login/login.component';
import {BetsCmp} from './bets/bets.component';
import {TableCmp} from './table/table.component';
import {LeaguesCmp} from './leagues/leagues.component';
import {LeagueInvitationCmp} from './leagues/invitation/league-invitation.component';

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
    <bets-sidenav-layout *ngIf="auth.authenticated">
      <router-outlet></router-outlet>
    </bets-sidenav-layout>

    <bets-login *ngIf="!auth.authenticated "></bets-login>
  `
})
@RouteConfig([
  {path: '/', name: 'Index', redirectTo: ['/Bets']},
  {path: '/bets/...', component: BetsCmp, as: 'Bets'},
  {path: '/table', name: 'Table', component: TableCmp},
  {path: '/leagues', name: 'Leagues', component: LeaguesCmp},
  {path: '/leagues/:leagueSlug/invitations/:invitationCode', name: 'LeaguesInvitation', component: LeagueInvitationCmp},
  {path: '/**', redirectTo: ['/Bets']}
])
export class App {

  constructor(private auth:Auth, translate:TranslateService) {
    console.log('app @ init');

    this.configureI18n(translate);
  }

  private configureI18n(translate) {
    translate.setDefaultLang(DEFAULT_LANG);

    var userLang = UserLang.getLang();
    translate.use(userLang);

    moment.lang(userLang);
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
