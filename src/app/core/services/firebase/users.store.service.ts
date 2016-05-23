import {Injectable} from 'angular2/core';

import * as Firebase from 'firebase';
import {AuthProviders} from 'angularfire2/angularfire2';

import {FIREBASE_BASE_URL} from './firebase.constants';
import {Auth} from './auth.service';
import {UserData} from './auth.model';

const PROVIDERS_WITH_DATA = [AuthProviders.Google, AuthProviders.Facebook, AuthProviders.Twitter];

@Injectable()
export class UsersStore {

  constructor() {
  }

  save(userData:UserData):Promise<void> {
    let ref = new Firebase(`${FIREBASE_BASE_URL}/users/${userData.uid}`);

    return ref.once('value')
      .then((snapshot:FirebaseDataSnapshot) => {

        let exists = snapshot.exists();
        console.log('users store @ user exists: ', exists);

        if (exists) {
          console.log('users store @ update user');
          let updatableData = this.getUpdatableData(userData);

          return ref.update(updatableData);
        }

        console.log('users store @ create user data');

        return ref.set(userData);
      });
  }

  private getUpdatableData(userData:UserData) {
    let updatableData = {
      timestamp: Firebase.ServerValue.TIMESTAMP,
      profileImageURL: userData.profileImageURL
    };

    // update display name only if auth provider provides display name
    // i.e: AuthProviders.Password does not give the display name
    if (PROVIDERS_WITH_DATA.indexOf(userData.provider) !== -1) {
      updatableData['displayName'] = userData.displayName;
    }

    return updatableData;
  }

}
