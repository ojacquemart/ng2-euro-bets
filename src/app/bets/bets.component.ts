import {Component} from 'angular2/core';
import {RouteConfig} from 'angular2/router';

import {Observable} from 'rxjs/Observable';

import {Page, PageTitle} from '../core/services/page-title';

import {MatchesBetsCmp} from './matches/matches.component';
import {GroupsBetsCmp} from './groups/groups.component';
import {FavoritesBetsCmp} from './favorites/favorites.component';

import {BetsStore} from './services/bets.store.service';
import {Match, MatchGroup} from './models/bets.models';

const PAGE:Page = {title: 'Bets'};

@RouteConfig([
  {path: '/matchs', as: 'Matchs', component: MatchesBetsCmp, useAsDefault: true},
  {path: '/groups', as: 'Groups', component: GroupsBetsCmp},
  {path: '/favorites', as: 'Favorites', component: FavoritesBetsCmp}
])
@Component({
  template: require('./bets.html'),
  styles: [require('./bets.scss')]
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
