import {Component, Input, ApplicationRef} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {MATERIAL_DIRECTIVES, Media, SidenavService} from 'ng2-material/all';

import {Observable} from 'rxjs/Observable';

import {Auth} from '../../services/firebase/auth.service';
import {Pages} from '../../services/navigation/pages.service';
import {PageComponent} from '../../services/navigation/pages.service';
import {UsersService} from '../../services/users/users.service';
import {UserLeaguesService} from '../../services/users/user-leagues.service';
import {EMPTY_USER_TABLE, UserTableIndexed} from '../../services/users/user-table.model';

import {UserAvatar} from '../user-avatar/user-avatar.component';
import {BetsService} from '../../../bets/services/bets.service';

import {RemainingBets} from './remaining-bets.service';
import {League} from '../../../leagues/models/league.models';

@Component({
  selector: 'bets-sidenav-layout',
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES, UserAvatar],
  providers: [SidenavService, RemainingBets],
  template: require('./sidenav-layout.html'),
  styles: [require('./sidenav-layout.scss')],
  host: {
    '[class.push-menu]': 'fullPage'
  }
})
export class SidenavLayoutCmp {

  @Input()
  private fullPage = this.media.hasMedia('gt-md');

  private numberOfRemainingBetsSubscription;
  private numberOfRemainingBets:number;
  private userTable:UserTableIndexed = EMPTY_USER_TABLE;
  private userLeagues$:Observable<Array<League>>;

  private pages$:Observable<Array<PageComponent>>;
  private currentPage:PageComponent;

  constructor(private auth:Auth,
              private pages:Pages, private remainingBets:RemainingBets,
              private router:Router,
              private userLeagues:UserLeaguesService, private users:UsersService,
              public appRef:ApplicationRef, public media:Media, public sidenav:SidenavService) {
    this.pages$ = this.pages.getPages();
  }

  navigate(linkParams:any) {
    return this.router.navigate(linkParams)
      .then(() => {
        this.hideMenuIfNotFullPage();
      });
  }

  hideMenuIfNotFullPage() {
    if (!this.fullPage) {
      this.sidenav.hide('menu');
    }
  }

  logout() {
    this.auth.logout();
  }

  hasMedia(breakSize:string):boolean {
    return this.media.hasMedia(breakSize);
  }

  open(name:string) {
    this.sidenav.show(name);
  }

  close(name:string) {
    this.sidenav.hide(name);
  }

  showMenu(event?) {
    this.sidenav.show('menu');
  }

  ngOnInit() {
    let query = Media.getQuery('gt-md');
    this.media.listen(query).onMatched.subscribe((mql:MediaQueryList) => {
      this.fullPage = mql.matches;
      this.appRef.tick();

      console.log('sidenav @ media listen', this.fullPage);
    });

    this.userLeagues$ = this.userLeagues.getLeagues();

    this.pages.subscribe((page:PageComponent) => {
      this.currentPage = page;
      this.appRef.tick();

      console.log('sidenav @ change page', page.title);
    });

    this.users.userTable$.subscribe(_ => this.userTable = _);

    this.numberOfRemainingBetsSubscription = this.remainingBets.getNumber()
      .subscribe(numberOfRemainingBets => this.numberOfRemainingBets = numberOfRemainingBets);
  }

}
