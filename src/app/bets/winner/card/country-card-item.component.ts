import {Component, Input} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {FlagIcon} from '../../../core/components/flag-icon/flag-icon.component';

import {Country} from '../../models/bets.models';

@Component({
  selector: 'winner-country-card-item',
  directives: [FlagIcon],
  template: require('./country-card-item.html'),
  styles: [require('./country-card-item.scss')]
})
export class WinnerCountryCardItemCmp {

  @Input()
  private lang:string;

  @Input()
  private country:Country;
}
