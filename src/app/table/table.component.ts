import {Component} from 'angular2/core';

import {Observable} from 'rxjs/Observable';
import {Pages} from '../core/services/navigation/pages.service';
import {Page} from '../core/services/navigation/pages.service';

import {Auth} from '../core/services/firebase/auth.service';

import {SettingsService} from '../core/services/settings/settings.service';
import {TablesService} from './services/tables.service'
import {UsersService} from '../core/services/users/users.service';

import {RecentsCmp} from './recents/recents.component';
import {PaginationCmp} from './pagination/pagination.component';
import {TableListCmp} from './table-list/table-list.component';

import {Pagination} from './models/page.model';
import {Table} from './models/table.models';
import {TableRow} from './models/table.models';
import {UserPosition} from './models/table.models';
import {UserTableIndexed} from '../core/services/users/user-table.model';

@Component({
  directives: [PaginationCmp, TableListCmp],
  styles: [require('./table.scss')],
  template: require('./table.html')
})
export class TableCmp {

  private loading = true;
  private emptyTable = false;

  private currentUid:string;
  private userPosition:UserPosition;
  private showingUserPosition:boolean;

  private tableRows:Array<TableRow>;
  private pagination:Pagination;

  private tableSubscription;

  constructor(pages:Pages, private auth:Auth, private tables:TablesService, private users:UsersService) {
    console.log('table @ init');

    pages.emit(Page.TABLE);
  }

  ngOnInit() {
    console.log('table @ ngOnInit');

    this.currentUid = this.auth.uid;
    this.setInitialTable();
  }

  private setInitialTable() {
    this.loading = true;

    this.tables.getGeneralTableUserPosition()
      .subscribe(_ => {
        this.userPosition = _;
        this.showingUserPosition = this.canShowUserPosition();
      });

    this.tableSubscription = this.tables.getGeneralTableRelativeToUser()
      .subscribe(
        _ => this.storeTable(_),
        _ => console.log('table @ error', _));
  }

  goTo(pagination:Pagination) {
    this.loading = true;
    this.showingUserPosition = false;

    console.log('table @ go to pagination', pagination);
    this.tableSubscription = this.tables.getGeneralTable(pagination)
      .subscribe(_ => this.storeTable(_));
  }

  canShowUserPosition() {
    return this.userPosition.userPosition !== '-';
  }

  private storeTable(table:Table) {
    this.tableRows = table.rows;
    this.pagination = table.pagination;
    this.loading = false;
    this.emptyTable = !table || table.rows.length === 0;
  }

  ngOnDestroy() {
    if (this.tableSubscription) {
      this.tableSubscription.unsubscribe();
    }
  }

}
