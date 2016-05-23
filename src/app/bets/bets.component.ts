import {Component} from 'angular2/core';
import {RouteConfig} from 'angular2/router';

import {Observable} from 'rxjs/Observable';

import {LoadingState} from '../core/services/loading-state/loading-state.service';
import {Pages, Page} from '../core/services/navigation/pages.service';

import {MatchesBetsCmp} from './matches/matches.component';
import {GroupsBetsCmp} from './groups/groups.component';
import {WinnerBetsCmp} from './winner/winner.component';

import {Match, MatchGroup} from './models/bets.models';

@RouteConfig([
  {path: '/matches', as: 'Matches', component: MatchesBetsCmp, useAsDefault: true},
  {path: '/groups', as: 'Groups', component: GroupsBetsCmp},
  {path: '/winner', as: 'Winner', component: WinnerBetsCmp}
])
@Component({
  template: require('./bets.html'),
  styles: [require('./bets.scss')]
})
export class BetsCmp {

  private loading = false;
  private loadingStateSubscription;

  constructor(private loadingState: LoadingState, pages:Pages) {
    console.log('bets @ init');

    pages.emit(Page.BETS);
  }

  ngOnInit() {
    console.log('bets @ ngOnInit');

    this.loadingStateSubscription = this.loadingState.subscribe((loading: boolean) => {
      this.loading = loading;
    });
  }

  ngOnDestroy() {
    if (this.loadingStateSubscription) {
      this.loadingStateSubscription.unsubscribe();
    }
  }

}
