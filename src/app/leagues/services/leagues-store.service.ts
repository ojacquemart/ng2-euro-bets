import {Inject,Injectable} from 'angular2/core';
import {Control} from 'angular2/common';

import {AngularFire} from 'angularfire2/angularfire2';
import {FirebaseRef} from 'angularfire2/tokens';
import 'rxjs/add/operator/map';

import {Auth} from '../../core/services/firebase/auth.service';
import {Slugifier} from '../../core/services/util/slugifer.service';
import {League, LeagueHolder, Members} from '../models/league.models';

@Injectable()
export class LeaguesStore {

  constructor(private auth:Auth, private af:AngularFire, @Inject(FirebaseRef) private ref:Firebase) {
  }

  list() {
    let userUid = this.auth.uid;

    return this.af.list('/leagues')
      .map((leagues:Array<League>) => {
        return leagues.map((league:League) => {
          let isInLeague = !!league.members[userUid];
          let isOwner = userUid === league.owner;

          return {
            league: league,
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
      });
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

  save(league:League, onSuccess:() => void) {
    league.slug = Slugifier.slugify(league.name);
    league.owner = this.auth.uid;
    league.members = {[`${league.owner}`]: true};

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