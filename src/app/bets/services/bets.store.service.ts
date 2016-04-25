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
import {Bet, Match, MatchGroup} from '../models/bets.models';
import {UserBetsStore} from './user-bets.store.service';

@Injectable()
export class BetsStore {

  loading:boolean;
  loading$:EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor(private af:AngularFire, private userBetsStore:UserBetsStore) {
  }

  subscribeLoadingState(fn:(loading:boolean) => void) {
    return this.loading$.subscribe(fn);
  }

  getMatchesByDay():Observable<Array<MatchGroup>> {
    this.startLoadingAndEmit();

    let fixtures$ = this.af.object('/fixtures');
    let userBets$ = this.userBetsStore.getBets$();

    return Observable.zip(fixtures$, userBets$, (matches:Array<Match>, userBets) => {
        userBets = userBets || {};

        matches.forEach((match:Match) => {
          var bet = userBets[match.number];
          this.setBetIfNeeded(match, bet);
        });

        return matches;
      })
      .map((matches:Array<Match>) => {
        return this.groupMatchesByDay(matches);
      })
      .catch((error:any) => {
        console.log('bets store @ error', error);

        return Observable.of([]);
      })
      .do(() => {
        this.stopLoadingAndEmit();
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
        return match.phase.code === 'group';
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

  startLoadingAndEmit() {
    this.loading = true;
    this.emitLoading();
  }

  private stopLoadingAndEmit() {
    this.loading = false;
    this.emitLoading();
  }

  private emitLoading() {
    this.loading$.emit(this.loading);
  }

}
