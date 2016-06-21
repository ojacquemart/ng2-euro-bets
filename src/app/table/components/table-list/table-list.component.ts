import {Component, Input} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {Auth} from '../../../core/services/firebase/auth.service';
import {SettingsService} from '../../../core/services/settings/settings.service';

import {ArrowEvolutionCmp} from '../arrow-evolution/arrow-evolution.component';
import {RecentsCmp} from '../recents/recents.component';

import {Pagination, PaginationConfig} from '../../models/pagination.model';
import {Table} from '../../models/table.models';
import {TableRow} from '../../models/table.models';

@Component({
  selector: 'table-list',
  directives: [ArrowEvolutionCmp, RecentsCmp],
  template: require('./table-list.html'),
  styles: [require('./table-list.scss')]
})
export class TableListCmp {

  private currentUid:string;

  @Input()
  private tableRows:Array<TableRow>;

  constructor(private auth:Auth) {
    console.log('table list @ init');
  }

  ngOnInit() {
    console.log('table list @ ngOnInit');

    this.currentUid = this.auth.uid;
  }

}
