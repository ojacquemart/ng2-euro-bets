import {AuthProviders} from 'angularfire2/angularfire2';

export interface Provider {
  name: string;
  code: string;
  authProvider: AuthProviders;
}

export const LOGIN_PROVIDERS: Array<Provider> = [
  {name: 'Facebook', code: 'facebook', authProvider: AuthProviders.Facebook},
  {name: 'Twitter', code: 'twitter', authProvider: AuthProviders.Twitter},
  {name: 'Google', code: 'google', authProvider: AuthProviders.Google}
];
