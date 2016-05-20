import {Component} from 'angular2/core';
import {ControlGroup, FormBuilder, Validators} from 'angular2/common';

import {Auth} from '../../core/services/firebase/auth.service';
import {UserCredentials} from '../../core/services/firebase/auth.model';

import {LoginLabels} from '../services/login-labels.helper';
import {EMAIL_VALIDATORS, PASSWORD_VALIDATORS} from '../services/form.helper';
import {ErrorBubble} from "../../core/components/error-bubble/error-bubble.component";

@Component({
  selector: 'login-sign-up',
  template: require('./sign-up.html'),
  styles: [require('./sign-up.scss')],
  directives: [ErrorBubble]
})
export class SignUpCmp {

  private LABELS;
  private form:ControlGroup;
  private userCredentials:UserCredentials = {
    displayName: '',
    credentials: {
      email: '',
      password: ''
    }
  };
  private error;

  constructor(private auth:Auth, fb:FormBuilder) {
    console.log('sign up @ init');

    this.LABELS = LoginLabels.getLabels();

    this.form = fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      email: ['', EMAIL_VALIDATORS],
      password: ['', PASSWORD_VALIDATORS]
    });
  }

  createUser() {
    this.error = false;

    if (this.form.valid) {
      console.log('sign up @ create user');

      this.auth.createUser(this.userCredentials)
        .catch(() => this.error = true);
    }
  }

}
