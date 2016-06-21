import {Injectable, Inject} from 'angular2/core';
import {FirebaseRef} from 'angularfire2/tokens';

import {Observable} from 'rxjs/Observable';

import {AngularFire, FirebaseObjectObservable} from 'angularfire2/angularfire2';

import {Auth} from "../../core/services/firebase/auth.service";
import {SettingsService} from '../../core/services/settings/settings.service';
import {UsersService} from '../../core/services/users/users.service';
import {UserTableIndexed} from '../../core/services/users/user-table.model';

import {LeagueTableRow} from "../models/table.models";
import {Pagination} from '../models/pagination.model';
import {Table} from '../models/table.models';
import {TableRow} from '../models/table.models';
import {UserPosition} from '../models/table.models';
import {UserPositionWithTable} from "../models/table.models";

const TABLE_PAGE_SIZE = 5;

@Injectable()
export class IndividualTableService {

  private nbRows$;

  constructor(private auth:Auth, private users:UsersService, private af:AngularFire, @Inject(FirebaseRef) private ref:Firebase) {
    this.nbRows$ = this.af.object('/tables/nbRows');
  }

  getLeagueTable(leagueSlug:string):Observable<Array<TableRow>> {
    console.log('tables @ get table index from league', leagueSlug);

    return this.af.object(`/tables_leagues/${leagueSlug}/table`);
  }

  getGeneralTableUserPosition():Observable<UserPosition> {
    console.log('tables @ get user position & table last position');

    return this.users.userTable$.flatMap((userTable:UserTableIndexed) => this.combineUserPositionWithLastPosition(userTable));
  }

  private combineUserPositionWithLastPosition(userTable:UserTableIndexed) {
    let tableLastPosition$ = this.af.object('/tables/lastPosition');

    return tableLastPosition$.map((tableLastPosition:number) => {
      return {userPosition: userTable.position || '-', tableLastPosition: tableLastPosition};
    });
  }

  getTableRelativeToUser():Observable<UserPositionWithTable> {
    console.log('tables @ get table index from user');

    let userTable$ = Observable.zip(this.users.userTable$, this.nbRows$, (userTable:UserTableIndexed, nbRows:number) => {
        return Pagination.create(userTable.index, TABLE_PAGE_SIZE, nbRows);
      })
      .flatMap((pagination:Pagination) => this.getTable(pagination));

    return Observable.zip(this.getGeneralTableUserPosition(), userTable$, (userPosition:UserPosition, table:Table) => {
      return {
        userPosition: userPosition,
        table: table
      };
    })
  }

  getTable(pagination:Pagination):Observable<Table> {
    console.log('tables @ get general tables', pagination);

    return Observable.fromPromise(this.ref.child('/tables').child('table')
      .orderByKey().startAt(pagination.currentIndex.toString()).limitToFirst(pagination.pageSize)
      .once('value'))
      .map(ds => {
        var value = ds.val();
        if (!value) {
          return Table.empty();
        }

        // array arrives here with missing index object
        // [undefined, undefined, undefine, object, object ...]
        // it rebuilds an array removing the undefined items

        let newArray = [];

        _(value)
          .filter(item => !!item)
          .forEach(val => newArray.push(val));

        return new Table(newArray, pagination);
      });
  }

}
