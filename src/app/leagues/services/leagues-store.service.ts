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

const DATE_PATTERN_LEAGUE_CREATED_AT = 'dddd DD MMMM';

@Injectable()
export class LeaguesStore {

  constructor(private auth:Auth, private loadingState:LoadingState, private af:AngularFire, @Inject(FirebaseRef) private ref:Firebase) {
  }

  find(leagueSlug:string): Observable<League> {
    return this.af.object(`/leagues/${leagueSlug}`);
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

  attachInvitationCode(league:League, invitationCode, onComplete:() => void) {
    console.log('leagues store @ attach invitation code', league, invitationCode);

    this.ref.child('/leagues').child(league.slug).update({invitationCode: invitationCode}, onComplete);
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

  update(league:League, previousLeague:League, onSuccess:() => void) {
    console.log('leagues store @', league, 'will replace', previousLeague);
    delete league['$key'];
    league.imageModerated = league.image !== previousLeague.image;
    league.updatedAt = Date.now();

    let onDeleteComplete = () => {
      league.members = previousLeague.members;
      this.save(league, onSuccess);
    };
    this.ref.child('/leagues').child(previousLeague.slug).remove(onDeleteComplete);
  }

  save(league:League, onSuccess:() => void) {
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
    leagueRef.set(league)
      .then((error:any) => {
        if (error) {
          log.error('leagues store @ save error', error);
          return;
        }

        leagueRef.child('members')
          .child(this.auth.uid).set(true, onSuccess);
      });
  }

  join(league:League) {
    this.ref.child('/leagues').child(league.slug).child('members').child(this.auth.uid).set(true);
  }

  leave(league:League) {
    this.ref.child('/leagues').child(league.slug).child('members').child(this.auth.uid).remove();
  }

  delete(league:League) {
    this.ref.child('/leagues').child(league.slug).remove();
  }

}
