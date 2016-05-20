import {Component} from 'angular2/core';

import {UefaEuroLogoCmp} from '../core/components/uefa-euro-logo/uefa-euro-logo.component';
import {UserLang} from '../core/services/util/user-lang.helper';

import {LoginLabels} from './services/login-labels.helper';
import {SignInCmp} from './sign-in/sign-in.component';
import {SignUpCmp} from './sign-up/sign-up.compoment';

@Component({
  selector: 'bets-login',
  directives: [UefaEuroLogoCmp, SignInCmp, SignUpCmp],
  template: require('./login.html'),
  styles: [require('./login.scss')]
})
export class LoginCmp {

  private LABELS;
  private showingSignIn = true;

  constructor() {
    console.log('login @ init');

    this.LABELS = LoginLabels.getLabels();
  }

  ngOnInit() {
    console.log('login @ ngOnInit');
  }

}
