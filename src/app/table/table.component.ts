import {Component} from 'angular2/core';
import {RouteConfig} from 'angular2/router';

import {Observable} from 'rxjs/Observable';

import {LoadingState} from '../core/services/loading-state/loading-state.service';
import {Pages} from '../core/services/navigation/pages.service';
import {Page} from '../core/services/navigation/pages.service';

import {IndividualTableCmp} from './individual/individual.component';
import {LeaguesTableCmp} from './leagues/leagues.component';

@RouteConfig([
  {path: '/individual', as: 'Individual', component: IndividualTableCmp, useAsDefault: true},
  {path: '/groups', as: 'Leagues', component: LeaguesTableCmp}
])
@Component({
  directives: [],
  styles: [require('./table.scss')],
  template: require('./table.html')
})
export class TableCmp {

  private loading = true;
  private loadingState$$;

  constructor(pages:Pages, private loadingState:LoadingState) {
    console.log('table @ init');

    pages.emit(Page.TABLE);
  }

  ngOnInit() {
    this.loadingState$$ = this.loadingState.subscribe((loading:boolean) => this.loading = loading);
  }

  ngOnDestroy() {
    if (this.loadingState$$) {
      this.loadingState$$.unsubscribe();
    }
  }

}
