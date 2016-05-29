import {Inject, Injectable} from 'angular2/core';

import {AngularFire, FirebaseRef, FirebaseObjectObservable} from 'angularfire2/angularfire2';
import {Observable} from 'rxjs/Observable';

import {UserData} from '../firebase/auth.model';
import {BetsService} from '../../../bets/services/bets.service';
import {MatchesService} from '../../../bets/services/matches.service';
import {Match} from '../../../bets/models/bets.models';

@Injectable()
export class UsersService {

  users$:FirebaseObjectObservable<Array<UserData>>;

  constructor(private bets:BetsService, private matches:MatchesService,
              private af:AngularFire, @Inject(FirebaseRef) private ref:Firebase) {
    this.users$ = af.object('/users');
  }

  get usersOnce$():Observable<Array<UserData>> {
    return Observable.fromPromise(this.ref.child('/users').once('value'))
      .map((dataSnapshot:FirebaseDataSnapshot) => dataSnapshot.val());
  }

}
