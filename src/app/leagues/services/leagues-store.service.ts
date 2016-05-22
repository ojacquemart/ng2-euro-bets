import * as moment from 'moment/moment';

import {Inject,Injectable} from 'angular2/core';
import {Control} from 'angular2/common';

import {AngularFire} from 'angularfire2/angularfire2';
import {FirebaseRef} from 'angularfire2/tokens';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {Auth} from '../../core/services/firebase/auth.service';
import {LoadingState} from '../../core/services/loading-state/loading-state.service';
import {Slugifier} from '../../core/services/util/slugifer.helper';
import {League, LeagueHolder, Members} from '../models/league.models';

@Injectable()
export class LeaguesStore {

  constructor(private auth:Auth, private loadingState:LoadingState, private af:AngularFire, @Inject(FirebaseRef) private ref:Firebase) {
  }

  find(leagueSlug:string):Observable<League> {
    this.loadingState.start();

    return this.af.object(`/leagues/${leagueSlug}`)
      .do(() => this.loadingState.stop());
  }

  list() {
    let userUid = this.auth.uid;

    this.loadingState.start();

    return this.af.list('/leagues')
      .map((leagues:Array<League>) => {
        return leagues.map((league:League) => {
          let isInLeague = !!league.members[userUid];
          let isOwner = userUid === league.owner;

          return {
            league: league,
            canShowBanner: !_.isEmpty(league.image) && league.imageModerated,
            membersCount: _.keys(league.members).length,
            actions: {
              canJoin: !isInLeague,
              canLeave: isInLeague && !isOwner,
              canAlter: isInLeague && isOwner
            }
          };
        });
      })
      .map((leagues:Array<LeagueHolder>) => {
        return _.sortBy(leagues, (leagueHolder:LeagueHolder) => leagueHolder.league.name);
      })
      .do(() => this.loadingState.stop());
  }

  attachInvitationCode(league:League, invitationCode) {
    console.log('leagues store @ attach invitation code', league, invitationCode);

    return this.ref.child('/leagues').child(league.slug).update({invitationCode: invitationCode});
  }

  validateExists(leagueName:string, resolve:any) {
    let slug = Slugifier.slugify(leagueName);
    if (_.isEmpty(slug)) {
      resolve({invalidName: true});

      return;
    }

    this.exists(slug, (exists:boolean) => {
      if (exists) {
        resolve({nameTaken: true});

        return;
      }

      resolve(null);
    })
  }

  exists(leagueSlug:string, callback:(foo:boolean) => void) {
    return this.ref.child('/leagues').once('value', (dataSnapshot:FirebaseDataSnapshot) => {
      return callback(dataSnapshot.hasChild(leagueSlug));
    });
  }

  update(league:League, previousLeague:League):Promise<void> {
    console.log('leagues store @', league, 'will replace', previousLeague);

    let imageModerated = previousLeague.imageModerated ? league.image === previousLeague.image : false;

    return this.ref.child('/leagues').child(previousLeague.slug)
      .update({
        name: league.name,
        description: league.description,
        image: league.image,
        imageModerated: imageModerated,
        updatedAt: Date.now()
      });
  }

  save(league:League):Promise<void> {
    league.slug = Slugifier.slugify(league.name);
    league.owner = this.auth.uid;
    league.ownerDisplayName = this.auth.user.displayName;
    league.ownerProfileImageURL = this.auth.user.profileImageURL;
    league.imageModerated = false;
    league.createdAt = Date.now();

    if (!league.members) {
      league.members = {};
    }
    league.members[`${league.owner}`] = true;

    var leagueRef = this.ref.child('/leagues').child(league.slug);

    return leagueRef.set(league)
      .then(() => {
        leagueRef.child('members').child(this.auth.uid).set(true);
      })
      .then(() => {
        return this.attachUserLeague(league);
      });
  }

  join(league:League) {
    return this.ref.child('/leagues').child(league.slug).child('members').child(this.auth.uid).set(true)
      .then(() => this.attachUserLeague(league));
  }

  leave(league:League) {
    return this.ref.child('/leagues').child(league.slug).child('members').child(this.auth.uid).remove()
      .then(() => this.detachUserLeague(league));
  }

  delete(league:League) {
    return this.ref.child('/leagues').child(league.slug).remove()
      .then(() => this.detachUserLeague(league));
  }

  attachUserLeague(league:League) {
    return this.getUserLeagues(league).set(true);
  }

  detachUserLeague(league:League) {
    return this.getUserLeagues(league).remove();
  }

  getUserLeagues(league:League) {
    return this.ref.child(`users/${this.auth.uid}/leagues/${league.slug}`);
  }

}
