import {Injectable, Inject} from 'angular2/core';

import {FirebaseRef} from 'angularfire2/tokens';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2/angularfire2';
import {Observable} from 'rxjs/Observable';

import {SettingsService} from '../../core/services/settings/settings.service';
import {UsersService} from '../../core/services/users/users.service';
import {UserTableIndexed} from '../../core/services/users/user-table.model';

import {Table} from '../models/table.models';
import {TableRow} from '../models/table.models';
import {Pagination} from '../models/page.model';

const TABLE_PAGE_SIZE = 5;

@Injectable()
export class TablesService {

  private nbRows$;

  constructor(private users:UsersService, private af:AngularFire, @Inject(FirebaseRef) private ref:Firebase) {
    this.nbRows$ = this.af.object('/tables/nbRows');
  }

  getLeagueTable(leagueSlug: string):Observable<Array<TableRow>> {
    console.log('tables @ get table index from league', leagueSlug);

    return this.af.object(`/tables_leagues/${leagueSlug}/table`);
  }

  getGeneralTableRelativeToUser():Observable<Table> {
    console.log('tables @ get table index from user');

    return Observable.zip(this.users.userTable$, this.nbRows$, (userTable:UserTableIndexed, nbRows:number) => {
        return Pagination.create(userTable.index, TABLE_PAGE_SIZE, nbRows);
      })
      .flatMap((pagination:Pagination) => this.getGeneralTable(pagination));
  }

  getGeneralTable(pagination:Pagination):Observable<Table> {
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
