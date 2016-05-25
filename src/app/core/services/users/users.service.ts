import {Inject, Injectable} from 'angular2/core';

import {AngularFire, FirebaseRef, FirebaseObjectObservable} from 'angularfire2/angularfire2';
import {Observable} from 'rxjs/Observable';

import {UserData} from '../firebase/auth.model';

@Injectable()
export class UsersService {

  users$:FirebaseObjectObservable<Array<UserData>>;

  constructor(private af:AngularFire, @Inject(FirebaseRef) private ref:Firebase) {
    this.users$ = af.object('/users');
  }

  get usersOnce$():Observable<Array<UserData>> {
    return Observable.fromPromise(this.ref.child('/users').once('value'))
      .map((dataSnapshot:FirebaseDataSnapshot) => dataSnapshot.val());
  }

}
