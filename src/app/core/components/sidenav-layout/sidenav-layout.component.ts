import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {MATERIAL_DIRECTIVES, Media, SidenavService} from 'ng2-material/all';

import {Auth} from '../../services/firebase/auth.service';
import {UserAvatar} from '../user-avatar/user-avatar.component';
import {UefaEuroLogoCmp} from '../uefa-euro-logo/uefa-euro-logo.component';

@Component({
  selector: 'pronos-sidenav-layout',
  directives: [ROUTER_DIRECTIVES, MATERIAL_DIRECTIVES, UserAvatar, UefaEuroLogoCmp],
  providers: [SidenavService],
  styles: [require('./sidenav-layout.scss')],
  template: require('./sidenav-layout.html')
})
export class SidenavLayoutCmp {

  @Input()
  private fullPage = Media.hasMedia('gt-md');

  constructor(public media:Media, public sidenav:SidenavService, private auth: Auth) {
    console.log('sidenav#init');
  }

  logout() {
    this.auth.logout();
  }

  hasMedia(breakSize:string):boolean {
    return Media.hasMedia(breakSize);
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
    this.media.listen(query).onMatched.subscribe((mql: MediaQueryList) => {
      this.fullPage = mql.matches;
    });
  }

}
