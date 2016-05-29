import {Inject, Injectable} from 'angular2/core';

import {AngularFire, FirebaseObjectObservable} from 'angularfire2/angularfire2';
import {FirebaseRef} from 'angularfire2/tokens';

import {Observable} from 'rxjs/Observable';

import {Auth} from '../../core/services/firebase/auth.service';
import {Match} from '../models/bets.models';
import {Country} from '../models/bets.models';

@Injectable()
export class BetsService {

  constructor(private auth:Auth,
    private af:AngularFire, @Inject(FirebaseRef) private ref:Firebase) {
  }

  get bets$():FirebaseObjectObservable<Array<Match>> {
    return this.af.object(`/bets/${this.auth.uid}/matches`);
  }

  get betsOnce$():Observable<FirebaseDataSnapshot> {
    // use ref once instead of af object to avoid to refresh all promises related to bets
    return Observable.fromPromise(this.ref.child(`/bets/${this.auth.uid}/matches`).once('value'));
  }

  get winner$():FirebaseObjectObservable<any> {
    return this.af.object(`/bets_favorites/${this.auth.uid}/country`);
  }

  save(match:Match, onSuccess:() => void, onError:() => void) {
    console.log('bets @ save', match);

    return this.af.object(`/bets/${this.auth.uid}/matches/${match.number}`).set(match.bet);
  }

  saveCountry(country:Country, onSuccessCallback:(country:Country) => void) {
    this.ref.child(`/bets_favorites/${this.auth.uid}`).child('country')
      .set(country.isoAlpha2Code, (error:any) => {
        if (!error) {
          console.log('bets favorite country @ save successful');
          onSuccessCallback(country);

          return;
        }

        console.log('bets favorite country @ save error:', error);
      });
  }

}
