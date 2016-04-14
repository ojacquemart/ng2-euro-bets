import * as _ from 'lodash';

import {Match, MatchGroup} from '../models/bets.models';
import Dictionary = _.Dictionary;

const STADIUMS = [
  'bordeaux', 'lille', 'lens', 'lyon', 'marseille',
  'nice', 'paris-sdf', 'paris-parc', 'saintetienne', 'toulouse'];

export class BetsStore {


  getMatchesByDay() {
    // TODO: fetch matches & user bets from firebase

    let matches:Array<Match> = [];
    matches.push({
      phase: 'GROUP A',
      day: '2016-10-11',
      hour: '21:00',
      finished: false,
      stadium: {code: 'lille', city: 'Lille', name: 'Pierre Mauroy'},
      bet: {homeGoals: 1, awayGoals: 4},
      home: {name: 'ENGLAND', flag: 'flag-icon-gb-eng', winner: false, goals: -1},
      away: {name: 'RUSSIA', flag: 'flag-icon-ru', winner: false, goals: -1}
    });
    matches.push({
      phase: 'GROUP A',
      day: '2016-10-11',
      hour: '17:00',
      finished: false,
      stadium: {code: 'marseille', city: 'Marseille', name: 'Vélodrome'},
      bet: {homeGoals: 1, awayGoals: 4},
      home: {name: 'ITALIA', flag: 'flag-icon-it', winner: false, goals: -1},
      away: {name: 'ROMANIA', flag: 'flag-icon-ro', winner: false, goals: -1}
    });
    matches.push({
      phase: 'GROUP B',
      day: '2016-10-12',
      hour: '18:00',
      stadium: {code: 'bordeaux', city: '???', name: '....'},
      finished: false,
      bet: {homeGoals: null, awayGoals: null},
      home: {name: 'SWEDEN', flag: 'flag-icon-se', winner: false, goals: -1},
      away: {name: 'WALES', flag: 'flag-icon-gb-wls', winner: false, goals: -1}
    });

    STADIUMS.forEach(stadium => {
      matches.push({
        phase: 'GROUP A',
        day: '2016-10-13',
        hour: '15:00',
        stadium: {code: stadium, city: '???', name: '???'},
        finished: true,
        bet: {homeGoals: 4, awayGoals: 2},
        home: {name: 'FRANCE', flag: 'flag-icon-fr', goals: 1, winner: false},
        away: {name: 'SWIZZ', flag: 'flag-icon-ch', goals: 2, winner: true}
      });
    });

    return _.chain(matches)
      .groupBy('day')
      .toPairsIn()
      .sortBy((keyValues) => keyValues[0])
      .map((keyValues) => {
        return <MatchGroup>{
          day: keyValues[0],
          items: _.sortBy<Match>(<Array<Match>> keyValues[1], ['hour'])
        };
      })
      .value();
  }

}
