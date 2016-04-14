import {Component} from 'angular2/core';
import {Auth} from "../../services/firebase/auth.service";

@Component({
  selector: 'bets-user-avatar',
  styles: [require('./user-avatar.scss')],
  template: require('./user-avatar.html')
})
export class UserAvatar {

  private user:FirebaseAuthDataGoogle = null;

  constructor(private auth: Auth) {}

  ngOnInit() {
    this.user = this.auth.user;
  }

}
