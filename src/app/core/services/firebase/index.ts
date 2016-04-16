import {FIREBASE_BASE_URL} from './firebase.constants';
import {FIREBASE_PROVIDERS, AuthMethods, firebaseAuthConfig, defaultFirebase} from 'angularfire2/angularfire2';

import {Auth} from './auth.service';
import {OnLoginLogger} from './on-login-logger.service';

export const APP_FIREBASE_PROVIDERS = [
  FIREBASE_PROVIDERS,
  defaultFirebase(FIREBASE_BASE_URL),
  firebaseAuthConfig({
    method: AuthMethods.Popup
  })
];

export const APP_AUTH_PROVIDERS = [
  Auth, OnLoginLogger
];
