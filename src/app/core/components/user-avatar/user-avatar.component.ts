import {Component} from 'angular2/core';

import {Auth} from '../../services/firebase/auth.service';

import {UefaEuroLogoCmp} from '../uefa-euro-logo/uefa-euro-logo.component';

@Component({
  selector: 'bets-user-avatar',
  directives: [UefaEuroLogoCmp],
  template: require('./user-avatar.html'),
  styles: [require('./user-avatar.scss')]
})
export class UserAvatar {

  private user:FirebaseAuthDataGoogle = null;

  constructor(private auth: Auth) {}

  ngOnInit() {
    this.user = this.auth.user;
  }

}
