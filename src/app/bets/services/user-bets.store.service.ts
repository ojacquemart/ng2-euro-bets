import {Inject, Injectable} from 'angular2/core';
import {AngularFire} from 'angularfire2/angularfire2';
import {FirebaseRef} from 'angularfire2/tokens';

import {Observable} from 'rxjs/Observable';

import {Auth} from '../../core/services/firebase/auth.service';
import {Match} from '../models/bets.models';
import {Country} from "../models/bets.models";

@Injectable()
export class UserBetsStore {

  constructor(private auth:Auth, private af:AngularFire, @Inject(FirebaseRef) private ref:Firebase) {
  }

  save(match:Match) {
    console.log('bets @ save', match);

    this.ref.child(`/bets/${this.auth.uid}`).child(`/matches/${match.number}`)
      .set(match.bet, (error:any) => {
        if (!error) {
          console.log('bets @ save successful');
          return;
        }

        console.log('bets @ save error:', error);
      });
  }

  getBets$() {
    return this.af.object(`/bets/${this.auth.uid}/matches`);
  }

  getCountry() {
    return this.af.object(`/bets_favorites/${this.auth.uid}/country`);
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
