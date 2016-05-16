import {Inject, Injectable} from 'angular2/core';
import {Router} from 'angular2/router';

import {AuthProviders, FirebaseAuth, FirebaseAuthState} from 'angularfire2/angularfire2';

import {OnLoginLogger} from './on-login-logger.service';
import {ConnectionEntry} from './connection-entry.model';

@Injectable()
export class Auth {

  private authState:FirebaseAuthState = null;

  constructor(private auth$:FirebaseAuth, private onLoginLogger:OnLoginLogger) {
    console.log('aut @ init');

    auth$.subscribe((state:FirebaseAuthState) => {
      if (!state) {
        console.log('auth @ onAuth - ko');
        return;
      }

      console.log('auth @ onAuth - ok');
      this.authState = state;
    });
  }

  get authenticated():boolean {
    return this.authState != null;
  }

  get uid():string {
    return this.authState.uid;
  }

  get user():FirebaseAuthDataGoogle {
    let provider = AuthProviders[this.authState.provider].toLowerCase();

    return this.authState[provider];
  }

  login(provider:AuthProviders):Promise<FirebaseAuthState> {
    return this.auth$.login({
      provider: provider,
      scope: ['email']
    }).then((authState:FirebaseAuthState) => this.handleOnLogin(authState));
  }

  private handleOnLogin(authState:FirebaseAuthState) {
    this.authState = authState;
    this.onLogin();

    return authState;
  }

  private onLogin() {
    console.log('auth @ after login');

    let connectionEntry:ConnectionEntry = {
      uid: this.uid,
      name: this.user.displayName,
      email: this.user.email || '',
      profileImageURL: this.user.profileImageURL,
      timestamp: Firebase.ServerValue.TIMESTAMP
    };
    this.onLoginLogger.log(connectionEntry);
  }

  logout() {
    this.auth$.logout();
    this.authState = null;
  }


}
