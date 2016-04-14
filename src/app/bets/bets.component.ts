import {Component} from 'angular2/core';

import {BetCardCmp} from './card/bet-card.component';

import {BetsStore} from './services/bets.store.service';
import {Match, MatchGroup} from './models/bets.models';

@Component({
  directives: [BetCardCmp],
  styles: [require('./bets.scss')],
  template: require('./bets.html')
})
export class BetsCmp {

  private matchesByDay: Array<MatchGroup> = null;

  constructor() {
    console.log('betsCmp @ init');

    this.matchesByDay = new BetsStore().getMatchesByDay();
    console.log(this.matchesByDay);
  }

  ngOnInit() {
    console.log('betsCmp @ ngOnInit');
  }

}
