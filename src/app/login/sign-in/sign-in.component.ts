import {Component} from 'angular2/core';
import {FormBuilder} from 'angular2/common';
import {ControlGroup} from 'angular2/common';

import {AuthProviders} from 'angularfire2/angularfire2';

import {Auth} from '../../core/services/firebase/auth.service';
import {ErrorBubble} from '../../core/components/error-bubble/error-bubble.component';

import {LoginLabels} from '../services/login-labels.helper';
import {EMAIL_VALIDATORS, PASSWORD_VALIDATORS} from '../services/form.helper';
import {LOGIN_PROVIDERS, Provider} from '../provider.model';

@Component({
  selector: 'login-sign-in',
  directives: [ErrorBubble],
  template: require('./sign-in.html'),
  styles: [require('./sign-in.scss')]
})
export class SignInCmp {

  private LABELS;
  private providers:Array<Provider>;
  private form:ControlGroup;
  private credentials:FirebaseCredentials = {
    email: '',
    password: ''
  };
  private error;

  constructor(private auth:Auth, fb:FormBuilder) {
    console.log('sign in @ init');

    this.LABELS = LoginLabels.getLabels();
    this.providers = LOGIN_PROVIDERS;

    this.form = fb.group({
      email: ['', EMAIL_VALIDATORS],
      password: ['', PASSWORD_VALIDATORS]
    });
  }

  loginWithProvider(provider:AuthProviders) {
    this.error = false;
    
    console.log('sign in @ login with provider', provider);

    this.auth.loginWithAuthProvider(provider);
  }

  loginWithCredentials() {
    this.error = false;

    if (this.form.valid) {
      console.log('sign in @ login with credentials');

      this.auth.loginWithCredentials(this.credentials)
        .catch(() => this.error = true);
    }
  }

}
