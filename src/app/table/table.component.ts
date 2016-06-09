import {Component} from 'angular2/core';
import {RouteData} from 'angular2/router';

import {Pages} from "../core/services/navigation/pages.service";
import {Page} from "../core/services/navigation/pages.service";

import {TablesService} from './services/tables.service'
import {Table} from "./models/table.models";
import {TableRow} from "./models/table.models";
import {RecentsCmp} from "./recents/recents.component";
import {SettingsService} from "../core/services/settings/settings.service";
import {Auth} from "../core/services/firebase/auth.service";
import {PaginationCmp} from "./pagination/pagination.component";
import {Pagination} from "./models/page.model";
import {Observable} from "rxjs/Observable";
import {TableListCmp} from "./table-list/table-list.component";

@Component({
  directives: [PaginationCmp, TableListCmp],
  template: require('./table.html'),
  styles: []
})
export class TableCmp {

  private loading = true;
  private emptyTable = false;

  private currentUid:string;
  private tableRows:Array<TableRow>;
  private pagination:Pagination;

  constructor(pages:Pages, private auth:Auth, private tables:TablesService) {
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

    this.tables.getGeneralTableRelativeToUser()
      .subscribe(
        _ => this.storeTable(_),
        _ => console.log('table @ error', _));
  }

  goTo(pagination:Pagination) {
    this.loading = true;
    console.log('table @ go to pagination', pagination);
    this.tables.getGeneralTable(pagination)
      .subscribe(_ => this.storeTable(_));
  }

  private storeTable(table:Table) {
    this.tableRows = table.rows;
    this.pagination = table.pagination;
    this.loading = false;
    this.emptyTable = !table || table.rows.length === 0;
  }

}
