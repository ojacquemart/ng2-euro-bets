import {Component} from 'angular2/core';
import {RouteConfig} from 'angular2/router';

import {Observable} from 'rxjs/Observable';

import {Page, PageTitle} from '../core/services/page-title';

import {MatchsBetsCmp} from './matchs/matchs-bets.component';
import {GroupsBetsCmp} from './groups/groups-bets.component';
import {FavoritesBetsCmp} from './favorites/favorites-bets.component';

import {BetsStore} from './services/bets.store.service';
import {Match, MatchGroup} from './models/bets.models';

const PAGE:Page = {title: 'Bets'};

@RouteConfig([
  {path: '/matchs', as: 'Matchs', component: MatchsBetsCmp, useAsDefault: true},
  {path: '/groups', as: 'Groups', component: GroupsBetsCmp},
  {path: '/favorites', as: 'Favorites', component: FavoritesBetsCmp}
])
@Component({
  styles: [require('./bets.scss')],
  template: require('./bets.html')
})
export class BetsCmp {

  private loading = true;
  private loadingStateSubscription;

  constructor(private betsStore:BetsStore, pageTitle:PageTitle) {
    console.log('bets @ init');

    pageTitle.emit(PAGE);
  }

  ngOnInit() {
    console.log('betsCmp @ ngOnInit');

    this.loadingStateSubscription = this.betsStore.subscribeLoadingState((loading: boolean) => {
      this.loading = loading;
    });
  }

  ngOnDestroy() {
    if (this.loadingStateSubscription) {
      this.loadingStateSubscription.unsubscribe();
    }
  }

}
