import {Inject, Injectable} from 'angular2/core';
import {Router} from 'angular2/router';

import {Observable} from 'rxjs/Observable';
import {AuthProviders, AuthMethods, FirebaseAuth, FirebaseAuthState} from 'angularfire2/angularfire2';

import {UsersStore} from './users.store.service';
import {UserData, UserCredentials} from './auth.model';

const NOOP = () => {};

@Injectable()
export class Auth {

  private authState:FirebaseAuthState = null;

  constructor(private auth$:FirebaseAuth, private usersStore:UsersStore) {
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

  get user() {
    let provider = AuthProviders[this.authState.provider].toLowerCase();
    var providerData = this.authState[provider];

    if (this.authState.provider === AuthProviders.Password) {
      return {
        displayName: providerData.email,
        profileImageURL: providerData.profileImageURL
      };
    }

    return providerData;
  }

  getProviderData(authData:FirebaseAuthData|FirebaseAuthState):FirebaseAuthDataGoogle {
    let provider = AuthProviders[authData.provider].toLowerCase();

    return authData[provider];
  }

  createUser(userCredentials:UserCredentials):Promise<FirebaseAuthData> {
    console.log('auth @ create user');

    return this.auth$.createUser(userCredentials.credentials)
      .then((authData:FirebaseAuthData) => {
        this.save({
          uid: authData.uid,
          displayName: userCredentials.displayName,
          profileImageURL: '',
          timestamp: Firebase.ServerValue.TIMESTAMP,
          provider: AuthProviders.Password,
        }, () => this.loginWithCredentials(userCredentials.credentials));

        return authData;
      });
  }

  loginWithCredentials(credentials:FirebaseCredentials):Promise<FirebaseAuthState> {
    console.log('auth @ login user');

    return this.auth$.login(credentials).then((authState) => this.handleOnLogin(authState));
  }

  loginWithAuthProvider(provider:AuthProviders):Promise<FirebaseAuthState> {
    return this.auth$.login({
      provider: provider,
      method: AuthMethods.Popup
    }).then((authState:FirebaseAuthState) => this.handleOnLogin(authState));
  }

  private handleOnLogin(authState:FirebaseAuthState) {
    this.authState = authState;

    let providerData = this.getProviderData(authState);

    this.save({
      uid: authState.uid,
      provider: authState.provider,
      displayName: providerData.displayName,
      profileImageURL: providerData.profileImageURL,
      timestamp: Firebase.ServerValue.TIMESTAMP
    });

    return authState;
  }

  private save(userData:UserData, onComplete:()=> void = NOOP) {
    console.log('auth @ after login');

    this.usersStore.save(userData, onComplete);
  }

  logout() {
    this.auth$.logout();
    this.authState = null;
  }

}
