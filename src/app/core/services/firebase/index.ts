import {FIREBASE_BASE_URL} from './firebase.constants';
import {FIREBASE_PROVIDERS, AuthMethods, firebaseAuthConfig, defaultFirebase} from 'angularfire2/angularfire2';

import {Auth} from './auth.service';
import {UsersStore} from './users.store.service';
import {AuthProviders} from 'angularfire2/angularfire2';

export const APP_FIREBASE_PROVIDERS = [
  FIREBASE_PROVIDERS,
  defaultFirebase(FIREBASE_BASE_URL),
  firebaseAuthConfig({
    method: AuthMethods.Password,
    provider: AuthProviders.Password,
  })
];

export const APP_AUTH_PROVIDERS = [
  Auth, UsersStore
];
