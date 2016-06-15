import {Inject, Injectable} from 'angular2/core';

import {Observable} from 'rxjs/Observable';
import {AngularFire, FirebaseRef, FirebaseObjectObservable} from 'angularfire2/angularfire2';

import {Auth} from '../../core/services/firebase/auth.service';
import {DAY_ID_GROUP_PHASE, SettingsService} from '../../core/services/settings/settings.service';
import {LoadingState} from '../../core/services/loading-state/loading-state.service';
import {SettingsGroup} from '../../core/services/settings/settings.service';

import {Country} from '../models/bets.models';
import {BetsService} from './bets.service';
import {CountriesService} from './countries.service';
import {CountryWinner} from '../models/bets.models';

@Injectable()
export class WinnerService {

  constructor(private bets:BetsService,
              private countries:CountriesService, private settings:SettingsService,
              private loadingState:LoadingState) {
  }

  getWinner():Observable<CountryWinner> {
    console.log('bets @ winner');
    this.loadingState.start();

    let settings$ = this.settings.settings$;

    return settings$.flatMap((settings:SettingsGroup) => this.zipCountriesWithUserWinner(settings))
      .do(() => this.loadingState.stop());
  }

  private zipCountriesWithUserWinner(settings:SettingsGroup):Observable<CountryWinner> {
    console.log('bets @ winner - zip countries with user selection');

    return Observable.zip(this.countries.countries$, this.bets.winner$, (countries:Array<Country>, userCountry) => {
      console.log('bets @ winner - do zip');
      let userWinner = this.getCountry(countries, userCountry);
      let canVote = settings.dayId <= DAY_ID_GROUP_PHASE;

      return {
        canVote: canVote,
        countries: canVote ? _.sortBy(countries, (country:Country) => country.i18n.fr) : [],
        userWinner: userWinner
      };
    });
  }

  private getCountry(countries:Array<Country>, userCountry:string) {
    if (!userCountry) {
      return null;
    }

    return countries.find((country:Country) => country.isoAlpha2Code === userCountry);
  }

}
