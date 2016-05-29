import {Injectable} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {MatchesService} from '../../../bets/services/matches.service';
import {BetsService} from '../../../bets/services/bets.service';
import {Match} from '../../../bets/models/bets.models';

@Injectable()
export class RemainingBets {

  constructor(private bets:BetsService, private matches:MatchesService) {
  }

  getNumber():Observable<number> {
    return this.bets.bets$.flatMap(bets => {
      if (bets === null) {
        return this.matches.getMatchesToBetAndToPlay().map(matches => matches.length);
      }

      return this.matches.getMatchesToBetAndToPlay().map(matches => {
        return matches.map((match:Match) => match.number)
          .filter(matchNumber => !bets[matchNumber]).length;
      });
    })
  }
}

