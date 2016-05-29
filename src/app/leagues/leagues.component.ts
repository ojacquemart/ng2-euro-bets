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

  private leagues$:Observable<Array<LeagueHolder>>;

  constructor(private leaguesStore:LeaguesStore,
              private leagueActionsHandler:LeagueActionsHandler,
              private element:ElementRef, private pages:Pages) {
    console.log('leagues @ init');
  }

  ngOnInit() {
    this.pages.emit(Page.LEAGUES);

    console.log('leagues @ ngOnInit');
    this.loading = true;
    this.leagues$ = this.leaguesStore.list()
      .do(_ => this.loading = false);
  }

}


