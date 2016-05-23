import * as _ from 'lodash';
import * as moment from 'moment/moment';

import {Inject, Injectable, EventEmitter} from 'angular2/core';
import {AngularFire, FirebaseObjectObservable} from "angularfire2/angularfire2";
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
  Match,
  MatchGroup,
  Matches,
  Status
} from '../models/bets.models';
import {BetsService} from './bets.service';
import {SettingsService} from '../../core/services/settings/settings.service';
import {SettingsGroup} from '../../core/services/settings/settings.service';
import {MatchHelper} from "./match.helper";
import {PHASE_GROUP_MAX_DAY_ID} from "../models/bets.models";

@Injectable()
export class MatchesService {

  matches$:FirebaseObjectObservable<Array<Match>>;

  constructor(af:AngularFire,
              private settings:SettingsService, private bets:BetsService,
              private loadingState:LoadingState) {
    this.matches$ = af.object('/fixtures');
  }

  getMatchesByDay():Observable<Matches> {
    console.log('bets @ get matches by day');
    this.loadingState.start();

    return this.getMatchesWithUserBets()
      .map((matches:Array<Match>) => {
        console.log('bets @ partition matches by status');

        let matchesByStatusToPlay = _.partition(matches, (match:Match) => {
          return match.status === Status.TO_PLAY;
        });

        return {
          current: MatchHelper.groupMatchesByDay(matchesByStatusToPlay[0]),
          history: MatchHelper.groupMatchesByDay(matchesByStatusToPlay[1])
        };
      })
      .catch((error:any) => {
        console.log('bets store @ error', error);

        return Observable.of({
          current: [],
          history: []
        });
      })
      .do(() => {
        this.loadingState.stop();
      });
  }

  getMatchesOfGroupPhase():Observable<Array<Match>> {
    return this.matches$.flatMap((matches:Array<Match>) => {
      return Observable.of(this.filterMatchesByDayId(matches, PHASE_GROUP_MAX_DAY_ID))
        .flatMap((matches:Array<Match>) => {
          return this.associateWithUserBet(matches);
        });
    });
  }

  getMatchesWithUserBets():Observable<Array<Match>> {
    return this.getMatchesToBet().flatMap((matches:Array<Match>) => {
      return this.associateWithUserBet(matches);
    });
  }

  private getMatchesToBet():Observable<Array<Match>> {
    return this.matches$.flatMap((matches:Array<Match>) => {
      return this.filterMatchesByDayIdAvailable(matches);
    })
  }

  private filterMatchesByDayIdAvailable(matches:Array<Match>):Observable<Array<Match>> {
    return this.settings.settings$.map((settings:SettingsGroup) => {
      return this.filterMatchesByDayId(matches, settings.dayId);
    });
  }

  private filterMatchesByDayId(matches:Array<Match>, dayId:number) {
    return matches.filter((match:Match) => match.dayId <= dayId);
  }

  private associateWithUserBet(matches:Array<Match>):Observable<Array<Match>> {
    return this.bets.bets$.map((userBets:FirebaseDataSnapshot) => {
      console.log(userBets.val());
      userBets = userBets.val() || {};

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

}
