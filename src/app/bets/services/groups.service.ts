import {Injectable} from "angular2/core";

import {FirebaseObjectObservable} from "angularfire2/angularfire2";
import {AngularFire} from "angularfire2/angularfire2";

import {Group} from "../models/bets.models";
import {LoadingState} from "../../core/services/loading-state/loading-state.service";
import {Observable} from "rxjs/Observable";
import {GroupTable} from "../models/bets.models";
import {Match} from "../models/bets.models";
import {MatchHelper} from "./match.helper";
import {MatchesService} from "./matches.service";

@Injectable()
export class GroupsService {

  groups$:FirebaseObjectObservable<Array<Group>>;

  constructor(private af:AngularFire, private matches:MatchesService, private loadingState:LoadingState) {
    this.groups$ = this.af.object('/groups');
  }

  getGroups():Observable<Array<GroupTable>> {
    console.log('groups @ get groups');
    this.loadingState.start();

    return this.groups$.flatMap((groups:Array<Group>) => {
        console.log('groups @ group matches by phase code');
        return this.associateGroupWithMatches(groups);
      })
      .do(() => this.loadingState.stop());
  }

  private associateGroupWithMatches(groups:Array<Group>) {
    return this.matches.getMatchesOfGroupPhase()
      .map((matches:Array<Match>) => {
        let matchesByGroup = _.groupBy(matches, (match:Match) => match.phase.code);

        return groups.map((group:Group) => {
          let groupMatches = matchesByGroup[group.code];
          let matchesByDay = MatchHelper.groupMatchesByDay(groupMatches);

          return {
            group: group,
            showMatches: false,
            matches: matchesByDay
          };
        });
      });
  }

}
