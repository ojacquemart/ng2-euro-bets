import {Component} from 'angular2/core';
import {RouteConfig} from 'angular2/router';

import {Observable} from 'rxjs/Observable';

import {LoadingState} from '../core/services/loading-state/loading-state.service';
import {Pages, Page} from '../core/services/navigation/pages.service';

import {MatchesBetsCmp} from './matches/matches.component';
import {GroupsBetsCmp} from './groups/groups.component';
import {FavoritesBetsCmp} from './favorites/favorites.component';

import {BetsStore} from './services/bets.store.service';
import {Match, MatchGroup} from './models/bets.models';

@RouteConfig([
  {path: '/matches', as: 'Matches', component: MatchesBetsCmp, useAsDefault: true},
  {path: '/groups', as: 'Groups', component: GroupsBetsCmp},
  {path: '/favorites', as: 'Favorites', component: FavoritesBetsCmp}
])
@Component({
  template: require('./bets.html'),
  styles: [require('./bets.scss')]
})
export class BetsCmp {

  private loading = false;
  private loadingStateSubscription;

  constructor(private betsStore:BetsStore, private loadingState: LoadingState, pages:Pages) {
    console.log('bets @ init');

    pages.emit(Page.BETS);
  }

  ngOnInit() {
    console.log('betsCmp @ ngOnInit');

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
