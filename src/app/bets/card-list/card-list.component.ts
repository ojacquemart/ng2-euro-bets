import {Component, Input} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {UserLang} from '../../core/services/util/user-lang.service';
import {FlagIcon} from '../../core/components/flag-icon/flag-icon.component';
import {BetCardListItemCmp} from '../card-list-item/card-list-item.component';
import {MatchGroup} from '../models/bets.models';

@Component({
  selector: 'bets-card-list',
  directives: [BetCardListItemCmp, FlagIcon],
  template: require('./card-list.html'),
  styles: [require('./card-list.scss')]
})
export class BetsCardListCmp {
  @Input()
  private matches:Array<MatchGroup>;

  private lang:string;

  constructor() {
    console.log('bets card list @ init');

    this.lang = UserLang.getLang();
  }

}
