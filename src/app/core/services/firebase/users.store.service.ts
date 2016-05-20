import {Injectable} from 'angular2/core';

import * as Firebase from 'firebase';

import {FIREBASE_BASE_URL} from './firebase.constants';
import {Auth} from './auth.service';
import {UserData} from './auth.model';
import {AngularFire, AuthProviders} from 'angularfire2/angularfire2';
import {Observable} from "rxjs/Observable";

const PROVIDERS_WITH_DATA = [AuthProviders.Google, AuthProviders.Facebook, AuthProviders.Twitter];

@Injectable()
export class UsersStore {

  constructor(private af:AngularFire) {
  }

  save(userData:UserData, onComplete:() => void) {
    console.log('users store @ log', userData);

    let ref = new Firebase(`${FIREBASE_BASE_URL}/users/${userData.uid}`);
    ref.once('value', (snapshot:FirebaseDataSnapshot) => {
      let exists = snapshot.exists();
      console.log('users store @ user exists: ', exists);

      if (exists) {
        console.log('users store @ update user');

        let updatableData = this.getUpdatableData(userData);
        ref.update(updatableData, onComplete);
        return;
      }

      console.log('users store @ create user data');

      ref.set(userData, onComplete);
    });
  }

  private getUpdatableData(userData:UserData) {
    let updatableData = {
      timestamp: Firebase.ServerValue.TIMESTAMP,
      profileImageURL: userData.profileImageURL
    };

    if (PROVIDERS_WITH_DATA.indexOf(userData.provider) !== -1) {
      updatableData['displayName'] = userData.displayName;
    }

    return updatableData;
  }

}
