import * as _ from 'lodash';

import {Inject, Injectable, EventEmitter} from 'angular2/core';
import {AngularFire} from 'angularfire2/angularfire2';
import {FirebaseRef} from 'angularfire2/tokens';
import Dictionary = _.Dictionary;

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/Rx';

import {Auth} from '../../core/services/firebase/auth.service';
import {LoadingState} from '../../core/services/loading-state/loading-state.service';

import {
  Bet,
  Country,
  CountryFavorite,
  Group,
  Match,
  MatchGroup,
  GroupTable} from '../models/bets.models';
import {UserBetsStore} from './user-bets.store.service';

@Injectable()
export class BetsStore {

  constructor(private af:AngularFire, private loadingState: LoadingState, private userBetsStore:UserBetsStore) {
  }

  getGroups():Observable<Array<GroupTable>> {
    this.loadingState.start();

    let groups$ = this.af.object('/groups');
    let matches = this.getMatchesBets$();

    return Observable.zip(groups$, matches, (groups:Array<Group>, matches:Array<Match>) => {
        let matchesByGroup = _.groupBy(matches, (match:Match) => match.phase.code);
        return groups.map((group:Group) => {
          let groupMatches = matchesByGroup[group.code];
          let matchesByDay = this.groupMatchesByDay(groupMatches);

          return {
            group: group,
            showMatches: false,
            matches: matchesByDay
          };
        });
      })
      .do(() => {
        this.loadingState.stop();
      });
  }

  getMatchesByDay():Observable<Array<MatchGroup>> {
    this.loadingState.start();

    return this.getMatchesBets$()
      .map((matches:Array<Match>) => {
        return this.groupMatchesByDay(matches);
      })
      .catch((error:any) => {
        console.log('bets store @ error', error);

        return Observable.of([]);
      })
      .do(() => {
        this.loadingState.stop();
      });
  }

  getCountries(): Observable<CountryFavorite> {
    this.loadingState.start();
    let countries$ = this.af.object('/countries');
    let userCountry$ = this.userBetsStore.getCountry();

    return Observable.zip(countries$, userCountry$, (countries:Array<Country>, userCountry) => {
      let favorite = this.getCountry(countries, userCountry);

      return {
        countries: _.sortBy(countries, (country: Country) => country.i18n.fr),
        favorite: favorite
      };
    })
    .do(() => {
      this.loadingState.stop();
    });
  }

  private getCountry(countries: Array<Country>, userCountry: string) {
    if (!userCountry) {
      return null;
    }

    return countries.find((country: Country) => country.isoAlpha2Code === userCountry);
  }

  private getMatchesBets$():Observable<Array<Match>> {
    let fixtures$ = this.af.list('/fixtures');
    let userBets$ = this.userBetsStore.getBets$();

    return Observable.zip(fixtures$, userBets$, (matches:Array<Match>, userBets) => {
      userBets = userBets || {};

      matches.forEach((match:Match) => {
        var bet = userBets[match.number];
        this.setBetIfNeeded(match, bet);
      });

      return matches;
    });
  }

  private setBetIfNeeded(match:Match, bet:Bet) {
    if (bet) {
      match.bet = bet;
    }

    if (!match.bet) {
      match.bet = {
        homeGoals: null,
        awayGoals: null
      };
    }
  }

  private groupMatchesByDay(matches:Array<Match>):Array<MatchGroup> {
    return _.chain(matches)
      .filter((match) => {
        return match.phase.state === 'group';
      })
      .groupBy('date')
      .toPairsIn()
      .map((keyValues) => {
        return <MatchGroup>{
          day: keyValues[0],
          items: _.sortBy<Match>(<Array<Match>> keyValues[1], ['hour'])
        };
      })
      .value();
  }

}
