import {Injectable} from "angular2/core";

import {Observable} from "rxjs/Observable";

import {AngularFire} from "angularfire2/angularfire2";

import {Auth} from "../../core/services/firebase/auth.service";

import {LeagueTableRow} from "../models/table.models";

@Injectable()
export class LeaguesTableService {

  constructor(private auth:Auth, private af:AngularFire) {
  }

  getLeaguesTable():Observable<Array<LeagueTableRow>> {
    return this.af.object(`/users/${this.auth.uid}/leagues`)
      .flatMap(leagues => this.mapLeaguesTablesRowsWithUserLeagues(leagues))
  }

  private mapLeaguesTablesRowsWithUserLeagues(leagues) {
    return this.af.object('/tables_global_leagues')
      .map(leaguesTableRows => {
        leaguesTableRows.forEach((leagueTableRow:LeagueTableRow) => leagueTableRow.userIn = !!leagues[leagueTableRow.slug]);

        return leaguesTableRows
      });
  }

}
