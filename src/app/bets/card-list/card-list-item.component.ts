import {Component, Input} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {FlagIcon} from '../../core/components/flag-icon/flag-icon.component';
import {BetCardListItemCmp} from '../card-list-item/card-list-item.component';
import {MatchGroup} from '../models/bets.models';

@Component({
  selector: 'bets-card-list',
  styles: [require('./card-list.scss')],
  template: require('./card-list.html'),
  directives: [BetCardListItemCmp, FlagIcon]
})
export class BetsCardListCmp {
  @Input()
  private matches: Array<MatchGroup>;

  constructor() {
    console.log('bets card list @ init');
  }

}
