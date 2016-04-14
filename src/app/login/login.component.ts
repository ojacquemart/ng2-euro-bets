import {Component} from 'angular2/core';

import {Auth} from '../core/services/firebase/auth.service';

import {UefaEuroLogoCmp} from '../core/components/uefa-euro-logo/uefa-euro-logo.component';

import {LOGIN_PROVIDERS} from './login-providers.constants';

@Component({
  selector: 'bets-login',
  directives: [UefaEuroLogoCmp],
  template: require('./login.html'),
  styles: [require('./login.scss')]
})
export class LoginCmp {

  private providers;

  constructor(private auth:Auth) {
    console.log('login#init');

    this.providers = LOGIN_PROVIDERS;
  }

  login(provider:string) {
    this.auth.login(provider);
  }

  ngOnInit() {
    console.log('login#ngOnInit');
  }

}
