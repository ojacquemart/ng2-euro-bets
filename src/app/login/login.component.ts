import {Component} from 'angular2/core';

import {Auth} from '../core/services/firebase/auth.service';

import {UefaEuroLogoCmp} from '../core/components/uefa-euro-logo/uefa-euro-logo.component';

import {LOGIN_PROVIDERS, Provider} from './provider.model';

@Component({
  selector: 'bets-login',
  directives: [UefaEuroLogoCmp],
  template: require('./login.html'),
  styles: [require('./login.scss')]
})
export class LoginCmp {

  private providers: Array<Provider>;

  constructor(private auth:Auth) {
    console.log('login @ init');

    this.providers = LOGIN_PROVIDERS;
  }

  ngOnInit() {
    console.log('login @ ngOnInit');
  }

}
