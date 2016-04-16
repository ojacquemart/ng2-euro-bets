import {Component} from 'angular2/core';

import {BetCardCmp} from './card/bet-card.component';

import {BetsStore} from './services/bets.store.service';
import {Match, MatchGroup} from './models/bets.models';

import {Page, PageTitle} from '../core/services/page-title';

const PAGE: Page = {title: 'Bets'};

@Component({
  directives: [BetCardCmp],
  styles: [require('./bets.scss')],
  template: require('./bets.html')
})
export class BetsCmp {

  private matchesByDay: Array<MatchGroup> = null;

  constructor(pageTitle: PageTitle) {
    console.log('bets @ init');

    pageTitle.emit(PAGE);

    this.matchesByDay = new BetsStore().getMatchesByDay();
    console.log(this.matchesByDay);
  }

  ngOnInit() {
    console.log('betsCmp @ ngOnInit');
  }

}
