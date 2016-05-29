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

@Component({
  directives: [LeagueImgCmp],
  styles: [require('./league-details.scss')],
  template: require('./league-details.html')
})
export class LeagueDetailsCmp {

  private loading = true;
  private leagueFinderSubscription;

  private leagueHolder:LeagueHolder;
  private members:Array<UserData>;

  constructor(private leaguesStore:LeaguesStore, private leagueActionsHandler:LeagueActionsHandler,
              private pages: Pages,
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
            return this.fetchLeague(league.slug);
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

    let leagueSlug = this.getCurrentSlug();
    this.fetchLeague(leagueSlug);
  }

  private fetchLeague(leagueSlug:string) {
    this.leagueFinderSubscription = this.leaguesStore.findWithMembers(leagueSlug)
      .subscribe((league:LeagueMembers) => {
        this.loading = false;

        console.log('league details @ league', league);

        this.leagueHolder = league.holder;
        this.members = league.members;

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
