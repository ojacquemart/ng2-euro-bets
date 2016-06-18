import {Injectable} from 'angular2/core';

import moment = require('moment/moment');
import {Observable} from 'rxjs/Observable';

import {AngularFire} from 'angularfire2/angularfire2';

import {MatchesService} from '../../bets/services/matches.service';
import {MatchHelper} from '../../bets/services/match.helper';
import {Match} from '../../bets/models/bets.models';

export interface Stat {
  matchNumber: number;
  match: Match;
  day: string;
  lastBetTimestamp:number;
  lastBetFormatted:string;
}

@Injectable()
export class StatsFetcher {

  constructor(private matches:MatchesService, private af:AngularFire) {
    console.log('stats fetcher @ init');
  }

  getStats():Observable<Array<Stat>> {
    let fixturesMap:Observable<Map<number,Match>> = this.matches.getMatchesWithUserBets()
      .map((matches:Array<Match>) => {
        let matchesIndexed:any = matches.map((match:Match) => {
          return [match.number, match];
        });

        return new Map<number,Match>(matchesIndexed);
      });

    return Observable.zip(this.af.list('/newscast/stats'), fixturesMap, (stats:Array<Stat>, matchesByNumber:Map<number, Match>) => {
      let statsWithMatch = stats.map((stat:Stat) => {
        let match = matchesByNumber.get(stat.matchNumber);
        stat.match = match;
        stat.day = MatchHelper.formatTimestamp(match.timestamp);
        stat.lastBetFormatted = moment(stat.lastBetTimestamp).format('HH:mm:ss');

        return stat;
      });

      return _.orderBy(statsWithMatch, 'matchNumber', 'desc');
    })
  }

}
