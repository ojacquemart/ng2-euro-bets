import {Component} from 'angular2/core';

import {Auth} from '../../services/firebase/auth.service';

@Component({
  selector: 'bets-user-avatar',
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
