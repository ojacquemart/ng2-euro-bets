import {Inject, Injectable} from 'angular2/core';
import {Router} from 'angular2/router';

import {Observable} from 'rxjs/Observable';
import {AuthProviders, AuthMethods, FirebaseAuth, FirebaseAuthState} from 'angularfire2/angularfire2';

import {UsersStore} from './users.store.service';
import {UserData, UserCredentials} from './auth.model';

@Injectable()
export class Auth {

  private authState:FirebaseAuthState = null;

  constructor(private auth$:FirebaseAuth, private usersStore:UsersStore) {
    console.log('auth @ init');

    auth$.subscribe((state:FirebaseAuthState) => {
      this.authState = state;

      if (!state) {
        console.log('auth @ onAuth - ko');
      } else {
        console.log('auth @ onAuth - ok');
      }
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

  createUser(userCredentials:UserCredentials):Promise<void> {
    console.log('auth @ create user');

    return this.auth$.createUser(userCredentials.credentials)
      .then((authData:FirebaseAuthData) => this.auth$.login(userCredentials.credentials))
      .then((authState:FirebaseAuthState) => {
        let providerData = this.getProviderData(authState);

        return this.save({
          uid: this.uid,
          provider: AuthProviders.Password,
          displayName: userCredentials.displayName,
          profileImageURL: providerData.profileImageURL,
          timestamp: Firebase.ServerValue.TIMESTAMP
        });
      });
  }

  loginWithCredentials(credentials:FirebaseCredentials):Promise<void> {
    console.log('auth @ login user');

    return this.auth$.login(credentials)
      .then((authState) => this.handleOnLogin(authState));
  }

  loginWithAuthProvider(provider:AuthProviders):Promise<void> {
    return this.auth$.login({provider: provider, method: AuthMethods.Popup})
      .then((authState:FirebaseAuthState) => this.handleOnLogin(authState));
  }

  private handleOnLogin(authState:FirebaseAuthState) {
    let providerData = this.getProviderData(authState);

    return this.save({
      uid: authState.uid,
      provider: authState.provider,
      displayName: providerData.displayName,
      profileImageURL: providerData.profileImageURL,
      timestamp: Firebase.ServerValue.TIMESTAMP
    });
  }

  private save(userData:UserData) {
    console.log('auth @ after login');

    this.usersStore.save(userData);
  }

  getProviderData(authData:FirebaseAuthData|FirebaseAuthState):FirebaseAuthDataGoogle {
    let provider = AuthProviders[authData.provider].toLowerCase();

    return authData[provider];
  }

  logout() {
    this.auth$.logout();
    this.authState = null;
  }

}
