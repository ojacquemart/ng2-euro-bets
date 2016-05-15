import {Component} from 'angular2/core';

import {Auth} from '../core/services/firebase/auth.service';

import {UefaEuroLogoCmp} from '../core/components/uefa-euro-logo/uefa-euro-logo.component';
import {UserLang} from '../core/services/util/user-lang.service';

import {LOGIN_PROVIDERS, Provider} from './provider.model';

const SIGN_IN_LABELS = {
  fr: 'Se connecter',
  en: 'Sign in'
};

@Component({
  selector: 'bets-login',
  directives: [UefaEuroLogoCmp],
  template: require('./login.html'),
  styles: [require('./login.scss')]
})
export class LoginCmp {

  private providers:Array<Provider>;
  private signInLabel;

  constructor(private auth:Auth) {
    console.log('login @ init');

    this.providers = LOGIN_PROVIDERS;
    this.signInLabel = SIGN_IN_LABELS[UserLang.getLang()];
  }

  ngOnInit() {
    console.log('login @ ngOnInit');
  }

}
