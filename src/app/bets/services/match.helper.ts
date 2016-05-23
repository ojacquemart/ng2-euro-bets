import * as moment from 'moment/moment';

import {MatchGroup} from '../models/bets.models';
import {Match} from '../models/bets.models';

const FIXTURE_DAY_PATTERN = 'dddd DD MMMM';

export class MatchHelper {

  static groupMatchesByDay(matches:Array<Match>):Array<MatchGroup> {
    if (_.isEmpty(matches)) {
      return [];
    }

    console.log('bets @ do group matches');

    return _.chain(matches)
      .groupBy('dateTimestamp')
      .toPairsIn()
      .map((keyValues) => {
        let dayFormatted = moment(parseInt(<string>keyValues[0])).format(FIXTURE_DAY_PATTERN).toUpperCase();

        return <MatchGroup>{
          day: <string>dayFormatted,
          items: _.sortBy<Match>(<Array<Match>> keyValues[1], ['hour'])
        };
      })
      .value();
  }

}
