import {Component,Input} from 'angular2/core';

import {FlagIcon} from '../../core/components/flag-icon/flag-icon.component';

import {Stat} from '../services/newscast-center.service';

import {BetCardListItemCmp} from '../../bets/card-list-item/card-list-item.component';

@Component({
  selector: 'newscast-stat-item',
  directives: [FlagIcon, BetCardListItemCmp],
  styles: [require('./stat-item.scss')],
  template: require('./stat-item.html')
})
export class StatItemCmp {
  @Input()
  private stat:Stat;
}
