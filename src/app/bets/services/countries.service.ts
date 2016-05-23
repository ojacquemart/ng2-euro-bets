import {Injectable} from 'angular2/core';

import {AngularFire, FirebaseObjectObservable} from 'angularfire2/angularfire2';

import {Country} from '../models/bets.models';

@Injectable()
export class CountriesService {

  countries$:FirebaseObjectObservable<Array<Country>>;

  constructor(af:AngularFire) {
    this.countries$ = af.object('/countries');
  }

}
