import {Component} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {Auth} from '../../core/services/firebase/auth.service';
import {LoadingState} from '../../core/services/loading-state/loading-state.service';
import {UsersService} from '../../core/services/users/users.service';

import {TableListCmp} from '../components/table-list/table-list.component';
import {PaginationCmp} from '../components/pagination/pagination.component';

import {IndividualTableService} from '../individual/individual-table.service';

import {Pagination} from '../models/pagination.model';
import {UserPosition} from '../models/table.models';
import {UserPositionWithTable} from '../models/table.models';
import {Table} from '../models/table.models';
import {TableRow} from '../models/table.models';

@Component({
  directives: [PaginationCmp, TableListCmp],
  styles: [require('./individual.scss')],
  template: require('./individual.html')
})
export class IndividualTableCmp {

  private loading = true;
  private emptyTable = false;

  private userPosition:UserPosition;
  private showingUserPosition:boolean;

  private tableRows:Array<TableRow>;
  private pagination:Pagination;

  private table$$;

  constructor(private loadingState:LoadingState, private individualTable:IndividualTableService) {
    console.log('individual table @ init');
  }

  private setInitialTable() {
    this.loadingState.start();

    this.table$$ = this.individualTable.getTableRelativeToUser()
      .subscribe((userPositionWithTable:UserPositionWithTable) => {
        this.storeTable(userPositionWithTable.table);

        this.userPosition = userPositionWithTable.userPosition;
        this.showingUserPosition = this.canShowUserPosition();
      });
  }

  goTo(pagination:Pagination) {
    this.showingUserPosition = false;

    console.log('individualtable @ go to pagination', pagination);

    this.loadingState.start();

    this.table$$ = this.individualTable.getTable(pagination)
      .subscribe(_ => this.storeTable(_));
  }

  canShowUserPosition() {
    return this.userPosition.userPosition !== '-';
  }

  private storeTable(table:Table) {
    this.tableRows = table.rows;
    this.pagination = table.pagination;
    this.emptyTable = !table || table.rows.length === 0;

    this.loadingState.stop();
  }

  ngOnInit() {
    console.log('individual table @ ngOnInit');

    this.loadingState.subscribe((loading:boolean) => this.loading = loading);

    this.setInitialTable();
  }

  ngOnDestroy() {
    if (this.table$$) {
      this.table$$.unsubscribe();
    }

    this.loadingState.stop();
  }

}
