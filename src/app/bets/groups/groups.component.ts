import {Component} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {UserLang} from '../../core/services/util/user-lang.helper';
import {FlagIcon} from '../../core/components/flag-icon/flag-icon.component';
import {BetsStore} from '../services/bets.store.service';
import {GroupTable} from '../models/bets.models';
import {BetsCardListCmp} from '../card-list/card-list.component';

@Component({
  directives: [BetsCardListCmp, FlagIcon],
  template: require('./groups.html'),
  styles: [require('./groups.scss')]
})
export class GroupsBetsCmp {

  private groups: Observable<Array<GroupTable>>;
  private lang: string;

  constructor(private betsStore:BetsStore) {
    console.log('groups bets @ init');

    this.lang = UserLang.getLang();
  }

  ngOnInit() {
    this.groups = this.betsStore.getGroups();
  }

}
