import {Component, ElementRef, ViewEncapsulation} from 'angular2/core';
import {LeaguesStore} from '../services/leagues-store.service';
import {Router, RouteParams} from 'angular2/router';
import {Observable} from 'rxjs/Observable';

import {UserData} from '../../core/services/firebase/auth.model';
import {UsersService} from '../../core/services/users/users.service';
import {Page, Pages} from '../../core/services/navigation/pages.service';
import {LeagueHolder} from '../models/league.models';

import {LeagueImgCmp} from '../league-image/image.component';
import {LeagueActionsHandler} from '../services/league-actions-handler.service';
import {League} from '../models/league.models';
import {LeagueMembers} from '../models/league.models';
import {TablesService} from "../../table/services/tables.service";
import {TableRow} from "../../table/models/table.models";
import {TableListCmp} from "../../table/table-list/table-list.component";
import {SettingsService} from "../../core/services/settings/settings.service";
import {SettingsGroup} from "../../core/services/settings/settings.service";

@Component({
  directives: [LeagueImgCmp, TableListCmp],
  styles: [require('./league-details.scss')],
  template: require('./league-details.html')
})
export class LeagueDetailsCmp {

  private loading = true;
  private leagueFinderSubscription;

  private showingLeagueTable: boolean;
  private leagueHolder:LeagueHolder;
  private members:Array<UserData>;
  private tableRows:Array<TableRow>;

  constructor(private leaguesStore:LeaguesStore, private leagueActionsHandler:LeagueActionsHandler,
              private pages:Pages,
              private settings:SettingsService,
              private routeParams:RouteParams,
              private elementRef:ElementRef) {
    console.log('invitation league @ init');
  }

  edit($event) {
    this.unsubscribe(this.leagueFinderSubscription);

    this.leagueActionsHandler.edit(this.leagueHolder.league, this.elementRef, $event)
      .then((league:League) => {
        if (league) {
          if (league.slug === this.getCurrentSlug()) {
            // league has changed other attributes, fetch the new values.
            return this.fetchLeague(league.slug, this.showingLeagueTable);
          }

          // league has changed its name, go to the new one.
          this.leagueActionsHandler.show(league);
        }
      });
  }

  delete(league:League, $event) {
    this.leagueActionsHandler.delete(league, this.elementRef, $event);
  }

  ngOnInit() {
    console.log('invitation league @ ngOnInit');

    this.pages.emit(Page.LEAGUES);

    this.settings.settings$
      .subscribe((settings:SettingsGroup) => {
        this.showingLeagueTable = settings.leagueTable;

        let leagueSlug = this.getCurrentSlug();
        this.fetchLeague(leagueSlug, settings.leagueTable);
      });
  }

  private fetchLeague(leagueSlug:string, showingLeagueTable:boolean) {
    this.leagueFinderSubscription = this.leaguesStore.findWithMembers(leagueSlug, showingLeagueTable)
      .subscribe((league:LeagueMembers) => {
        this.loading = false;

        console.log('league details @ league', league);

        this.leagueHolder = league.holder;
        this.members = league.members;
        this.tableRows = league.tableRows;

      }, _ => {
        console.log('league details @ error: ', _);
        this.leaguesStore.redirectToLeagues()
      });
  }

  private getCurrentSlug() {
    return this.routeParams.get('leagueSlug');
  }

  ngOnDestroy() {
    this.unsubscribe(this.leagueFinderSubscription);
  }

  private unsubscribe(subscriber) {
    if (subscriber) {
      subscriber.unsubscribe();
      subscriber = null;
    }
  }

}
