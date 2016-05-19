import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';

import {Auth} from '../../core/services/firebase/auth.service';
import {LoadingState} from '../../core/services/loading-state/loading-state.service';
import {Pages} from '../../core/services/navigation/pages.service';

import {League} from '../models/league.models';
import {LeaguesStore} from '../services/leagues-store.service';
import {Page} from "../../core/services/navigation/pages.service";

@Component({
  template: require('./league-invitation.html'),
  styles: [`
    .owner { font-weight: bold; }
  `]
})
export class LeagueInvitationCmp {

  private loading = true;
  private loadingStateSubscription;
  private leagueFinderSubscription;

  private league:League;

  constructor(private leaguesStore:LeaguesStore,
              private auth:Auth,
              private routeParams:RouteParams, private router:Router,
              private pages:Pages,
              loadingState:LoadingState) {
    console.log('invitation league @ init');

    this.loadingStateSubscription = loadingState.subscribe((loading:boolean) => {
      this.loading = loading;
    });
  }

  join() {
    console.log('invitation league @ join');
    this.leaguesStore.join(this.league);

    return this.redirectToLeagues();
  }

  ngOnInit() {
    console.log('invitation league @ ngOnInit');

    let leagueSlug = this.routeParams.get('leagueSlug');
    this.leagueFinderSubscription = this.leaguesStore.find(leagueSlug)
      .subscribe((league:League) => {
        if (league === null) {
          console.log('invitation league @ league', leagueSlug, ' not found. redirect to /leagues');

          return this.redirectToLeagues();
        }

        let invitationCode = this.routeParams.get('invitationCode');
        if (league.invitationCode !== invitationCode) {
          return this.redirectToLeagues();
        }

        if (!!league.members[this.auth.uid]) {
          return this.redirectToLeagues();
        }

        console.log('invitation league @ league', league);
        this.pages.emitPageTitle(league.name);
        this.league = league;
      });
  }

  redirectToLeagues() {
    return this.router.navigate(['Leagues']);
  }

  ngOnDestroy() {
    if (this.loadingStateSubscription) {
      this.loadingStateSubscription.unsubscribe();
    }
    if (this.leagueFinderSubscription) {
      this.leagueFinderSubscription.unsubscribe();
    }
  }

}
