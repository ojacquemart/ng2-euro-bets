import {Inject, Injectable} from 'angular2/core';

import {Observable} from 'rxjs/Observable';
import {AngularFire} from 'angularfire2/angularfire2';
import {FirebaseRef} from 'angularfire2/tokens';

import {Auth} from '../firebase/auth.service';
import {UserData} from '../firebase/auth.model';

import {LeaguesStore} from '../../../leagues/services/leagues-store.service';
import {League} from '../../../leagues/models/league.models';

import {UsersService} from './users.service';

@Injectable()
export class UserLeaguesService {

  constructor(private auth:Auth, private af:AngularFire, @Inject(FirebaseRef) private ref:Firebase) {
  }

  getLeagues():Observable<Array<League>> {
    let userLeagues$ = this.af.object(`/users/${this.auth.uid}/leagues`);
    let leagues$:Observable<Array<League>> = Observable.fromPromise(this.ref.child('/leagues').once('value'))
      .map(ds => ds.val());

    return userLeagues$.flatMap(userLeagues => {
      return leagues$.map(leagues => _.sortBy(_.filter(leagues, league => !!userLeagues[league.slug]), 'name'));
    });
  }

}
