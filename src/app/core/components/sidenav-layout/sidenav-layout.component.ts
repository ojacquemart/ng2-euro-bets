import {Component, Input, ApplicationRef} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {MATERIAL_DIRECTIVES, Media, SidenavService} from 'ng2-material/all';

import {Observable} from 'rxjs/Observable';
import {TranslateService} from 'ng2-translate/ng2-translate';

import {Auth} from '../../services/firebase/auth.service';
import {UserAvatar} from '../user-avatar/user-avatar.component';
import {Pages} from '../../services/navigation/pages.service';
import {PageComponent} from '../../services/navigation/pages.service';

import {BetsService} from '../../../bets/services/bets.service';
import {RemainingBets} from "./remaining-bets.service";

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

  private pages$:Observable<Array<PageComponent>>;
  private pageTitle:string;

  constructor(private auth:Auth, private remainingBets:RemainingBets, private router:Router,
              private pages:Pages,
              public appRef:ApplicationRef,
              public media:Media, public sidenav:SidenavService) {
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

    this.pages.subscribe((pageTitle:string) => {
      this.pageTitle = pageTitle;
      this.appRef.tick();

      console.log('sidenav @ change page', pageTitle);
    });

    this.numberOfRemainingBetsSubscription = this.remainingBets.getNumber()
      .subscribe(numberOfRemainingBets => this.numberOfRemainingBets = numberOfRemainingBets);
  }

}
