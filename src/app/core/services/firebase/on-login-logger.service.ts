import {Injectable} from 'angular2/core';

import * as Firebase from 'firebase';

import {FIREBASE_BASE_URL} from './firebase.constants';
import {Auth} from './auth.service';
import {ConnectionEntry} from './connection-entry.model';

@Injectable()
export class OnLoginLogger {

  constructor() {
  }

  log(connectionEntry: ConnectionEntry) {
    console.log('connectionEntryStore#log', connectionEntry);

    let ref = new Firebase(`${FIREBASE_BASE_URL}/users_connections/${connectionEntry.uid}`);
    ref.set(connectionEntry);
  }

}
