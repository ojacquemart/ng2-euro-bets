import {Inject, Injectable} from 'angular2/core';

import {AngularFire, FirebaseRef, FirebaseObjectObservable} from 'angularfire2/angularfire2';
import {Observable} from 'rxjs/Observable';

import {UserData} from '../firebase/auth.model';
import {Auth} from '../firebase/auth.service';

import {BetsService} from '../../../bets/services/bets.service';
import {MatchesService} from '../../../bets/services/matches.service';
import {Match} from '../../../bets/models/bets.models';

import {EMPTY_USER_TABLE, UserTableIndexed} from './user-table.model';

@Injectable()
export class UsersService {

  users$:FirebaseObjectObservable<Array<UserData>>;

  constructor(private auth:Auth,
              private af:AngularFire, @Inject(FirebaseRef) private ref:Firebase) {
    this.users$ = af.object('/users');
  }

  get usersOnce$():Observable<Array<UserData>> {
    return Observable.fromPromise(this.ref.child('/users').once('value'))
      .map((dataSnapshot:FirebaseDataSnapshot) => dataSnapshot.val());
  }

  get userTable$():Observable<UserTableIndexed> {
    console.log('users @ get table');
    let uid = this.auth.uid;

    return this.af.object(`/users_table_meta/${uid}`)
      .map((user:UserTableIndexed) => user || EMPTY_USER_TABLE);
  }

}
