import {Inject, Injectable} from 'angular2/core';
import {Router} from 'angular2/router';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import * as Firebase from 'firebase';

import {FIREBASE_BASE_URL} from './firebase.constants';

import {OnLoginLogger} from './on-login-logger.service';
import {ConnectionEntry} from './connection-entry.model';

@Injectable()
export class Auth {

  private ref:Firebase = new Firebase(FIREBASE_BASE_URL);
  private authData:FirebaseAuthData = null;

  private authenticatedSource:Subject<boolean> = new Subject<boolean>();
  public authenticated$:Observable<boolean>;

  constructor(private router:Router, private onLoginLogger: OnLoginLogger) {
    console.log('auth#init');
    this.authenticated$ = this.authenticatedSource.asObservable();
  }

  get authenticated():boolean {
    return this.authData != null;
  }

  get uid():string {
    return this.authData.uid;
  }

  onAuth() {
    let onAuthComplete = (authData:FirebaseAuthData) => {
      if (authData) {
        console.log('auth#auth ok');
        this.authData = authData;
        this.publishAuthenticated();

        return;
      }

      console.log('auth#not authenticated');
      this.publishUnauthenticated();
    };

    this.ref.onAuth(onAuthComplete);
  }

  get user():FirebaseAuthDataGoogle {
    let provider = this.authData.provider;

    return this.authData[provider];
  }

  login(provider:string) {
    let authWithOAuthPopupComplete = (error:any, authData:FirebaseAuthData) => {
      if (error) {
        console.log('auth#login failed', error);
        // TODO: toast error message

        return;
      }

      console.log('auth#login ok', authData);

      this.publishAuthenticated();
      this.afterLogin();
    };

    console.log('auth#login with', provider);

    this.ref.authWithOAuthPopup(provider, authWithOAuthPopupComplete);
  }

  private afterLogin() {
    console.log('auth#after login');

    let connectionEntry:ConnectionEntry = {
      uid: this.uid,
      name: this.user.displayName,
      timestamp: Firebase.ServerValue.TIMESTAMP
    };
    this.onLoginLogger.log(connectionEntry);
  }

  logout() {
    this.ref.unauth();
    this.authData = null;

    this.publishUnauthenticated();
  }

  private publishAuthenticated() {
    this.authenticatedSource.next(true);
  }

  private publishUnauthenticated() {
    this.authenticatedSource.next(false);
  }

}
