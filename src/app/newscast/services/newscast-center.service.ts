import {Injectable} from 'angular2/core';

import moment = require('moment/moment');
import {Observable} from 'rxjs/Observable';

import {AngularFire} from 'angularfire2/angularfire2';

import {MatchesService} from '../../bets/services/matches.service';

import {MatchHelper} from '../../bets/services/match.helper';
import {Match} from '../../bets/models/bets.models';

export interface Stat extends NewsObject {
  matchNumber: number;
  match: Match;
  day: string;
  lastBetTimestamp:number;
  lastBetFormatted:string;
}

export interface News extends NewsObject {
  day: string
  title: string;
  content: string;
}

export interface NewsObject {
  timestamp: number;
  type: string;
}

@Injectable()
export class NewscastCenter {

  constructor(private matches:MatchesService, private af:AngularFire) {
    console.log('newscastcenter @ init');
  }

  getNewscast():Observable<Array<NewsObject>> {
    console.log('newscastcenter @ get newscast');

    return this.getNews()
      .flatMap((news:Array<News>) => this.concatWithStats(news))
      .map((newsObjects:Array<NewsObject>) => _.orderBy(newsObjects, 'timestamp', 'desc'));
  }

  concatWithStats(news) {
    return this.getStats()
      .map((stats:Array<Stat>) => news.concat(stats));
  }

  getNews():Observable<Array<News>> {
    console.log('newscastcenter @ get news');

    return this.af.list('/newscast/news')
      .map(news => news.map(item => {
        item.day = MatchHelper.formatTimestamp(item.timestamp);

        return item;
      }));
  }

  getStats():Observable<Array<Stat>> {
    console.log('newscastcenter @ get stats');
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
