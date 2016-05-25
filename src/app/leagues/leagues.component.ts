import {ApplicationRef, Component, ElementRef} from 'angular2/core';
import {FORM_DIRECTIVES, Control, ControlGroup, FormBuilder, Validators} from 'angular2/common';

import {Observable} from 'rxjs/Observable';

import {LoadingState} from '../core/services/loading-state/loading-state.service';
import {Pages, Page} from '../core/services/navigation/pages.service';

import {League} from './models/league.models';
import {LeaguesStore} from './services/leagues-store.service';
import {PictureReader} from './services/picture.reader.helper';

import {LeagueHolder} from './models/league.models';
import {LeagueCardItemCmp} from "./league-card-item/league-card-item.component";
import {LeagueActionsHandler} from "./services/league-actions-handler.service";


@Component({
  template: require('./leagues.html'),
  styles: [require('./leagues.scss')],
  directives: [FORM_DIRECTIVES, LeagueCardItemCmp]
})
export class LeaguesCmp {

  private loading = false;
  private loadingStateSubscription;

  private leagues$:Observable<Array<LeagueHolder>>;

  constructor(private appRef:ApplicationRef,
              private leaguesStore:LeaguesStore,
              private leagueActionsHandler:LeagueActionsHandler,
              private element:ElementRef,
              loadingState:LoadingState, private pages:Pages) {
    console.log('leagues @ init');

    //this.loadingStateSubscription = loadingState.subscribe((loading:boolean) => {
    //  this.loading = loading;
    //});

  }

  ngOnInit() {
    this.pages.emit(Page.LEAGUES);

    console.log('leagues @ ngOnInit');
    this.loading = true;
    this.leagues$ = this.leaguesStore.list()
      .do(_ => this.loading =false);
  }

  ngOnDestroy() {
    if (this.loadingStateSubscription) {
      this.loadingStateSubscription.unsubscribe();
    }
  }

}


