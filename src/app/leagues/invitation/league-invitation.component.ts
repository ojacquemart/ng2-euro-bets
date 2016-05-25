import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {Auth} from '../../core/services/firebase/auth.service';
import {Pages} from '../../core/services/navigation/pages.service';
import {Page} from '../../core/services/navigation/pages.service';

import {LeaguesStore} from '../services/leagues-store.service';
import {League} from '../models/league.models';

@Component({
  template: require('./league-invitation.html'),
  styles: [`
    .owner { font-weight: bold; }
  `]
})
export class LeagueInvitationCmp {

  private loading = true;
  private leagueFinderSubscription;

  private league:League;

  constructor(private auth:Auth, private leaguesStore:LeaguesStore,
              private pages:Pages,
              private routeParams:RouteParams) {
    console.log('invitation league @ init');
  }

  join() {
    console.log('invitation league @ join');
    this.leaguesStore.join(this.league)
      .then(_ => this.leaguesStore.redirectToLeague(this.league.slug));
  }

  ngOnInit() {
    console.log('invitation league @ ngOnInit');

    this.pages.emit(Page.LEAGUES);

    let leagueSlug = this.routeParams.get('leagueSlug');

    this.leagueFinderSubscription = this.leaguesStore.findOnce(leagueSlug)
      .subscribe((league:League) => {
        if (!this.isInvitationCodeValid(league)) {
          return this.leaguesStore.redirectToLeagues();
        }
        if (this.isAlreadyMember(league)) {
          return this.leaguesStore.redirectToLeague(league.slug);
        }

        this.league = league;
        this.loading = false;
      });
  }

  private isInvitationCodeValid(league:League) {
    return league !== null && league.invitationCode === this.routeParams.get('invitationCode');
  }

  private isAlreadyMember(league:League) {
    return !!league.members[this.auth.uid];
  }

  ngOnDestroy() {
    this.unsubscribeLeagueFinder();
  }

  private unsubscribeLeagueFinder() {
    if (this.leagueFinderSubscription) {
      this.leagueFinderSubscription.unsubscribe();
    }
  }

}
