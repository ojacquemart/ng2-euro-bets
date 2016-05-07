import {Component} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {BetsStore} from '../services/bets.store.service';
import {GroupTable} from '../models/bets.models';
import {BetsCardListCmp} from '../card-list/card-list-item.component';

@Component({
  directives: [BetsCardListCmp],
  styles: [require('./groups.scss')],
  template: require('./groups.html')
})
export class GroupsBetsCmp {

  private groups: Observable<Array<GroupTable>>;

  constructor(private betsStore:BetsStore) {
    console.log('groups bets @ init');
  }

  ngOnInit() {
    this.groups = this.betsStore.getGroups();
  }

}