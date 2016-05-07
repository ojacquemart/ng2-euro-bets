import {Component} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {BetsCardListCmp} from '../card-list/card-list-item.component';
import {BetsStore} from '../services/bets.store.service';
import {MatchGroup} from '../models/bets.models';

@Component({
  directives: [BetsCardListCmp],
  template: require('./matches.html')
})
export class MatchesBetsCmp {

  private matches:Observable<Array<MatchGroup>> = null;

  constructor(private betsStore:BetsStore) {
    console.log('match bets @ init');
  }

  ngOnInit() {
    this.matches = this.betsStore.getMatchesByDay();
  }

}
