import {Component} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {BetCardCmp} from '../card/bet-card.component';
import {BetsStore} from '../services/bets.store.service';
import {MatchGroup} from '../models/bets.models';

@Component({
  directives: [BetCardCmp],
  template: require('./match-bets.html')
})
export class MatchsBetsCmp {

  private matchesByDay:Observable<Array<MatchGroup>> = null;

  constructor(private betsStore:BetsStore) {
    console.log('match bets @ init');
  }

  ngOnInit() {
    this.matchesByDay = this.betsStore.getMatchesByDay();
  }

}
