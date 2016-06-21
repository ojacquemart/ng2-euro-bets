import * as moment from 'moment/moment';

import {Inject,Injectable} from 'angular2/core';
import {Control} from 'angular2/common';
import {Router,RouteParams} from 'angular2/router';

import {AngularFire} from 'angularfire2/angularfire2';
import {FirebaseRef} from 'angularfire2/tokens';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {Auth} from '../../core/services/firebase/auth.service';
import {Pages, Page} from '../../core/services/navigation/pages.service';
import {Slugifier} from '../../core/services/util/slugifer.helper';
import {UsersService} from '../../core/services/users/users.service';
import {UserData} from '../../core/services/firebase/auth.model';

import {IndividualTableService} from "../../table/individual/individual-table.service";

import {League, LeagueHolder, Members} from '../models/league.models';
import {LeagueMembers} from '../models/league.models';
import {UniqueIdGenerator} from "../../core/services/util/unique-id-generator.helper";
import {TableRow} from "../../table/models/table.models";

@Injectable()
export class LeaguesStore {

  constructor(private auth:Auth, private individualTable: IndividualTableService, private users:UsersService,
              private af:AngularFire, @Inject(FirebaseRef) private ref:Firebase,
              private router:Router) {
  }

  image(imageKey:string):Observable<string> {
    return Observable.fromPromise(this.ref.child(`/leagues_images/${imageKey}`).once('value'))
      .map(dataSnapshot => dataSnapshot.val());
  }

  one(leagueSlug:string):Observable<League> {
    return this.af.object(`/leagues/${leagueSlug}`);
  }

  findOnce(leagueSlug:string):Observable<League> {
    return Observable.fromPromise(this.ref.child(`/leagues/${leagueSlug}`).once('value'))
      .map(dataSnapshot => dataSnapshot.val());
  }

  find(leagueSlug:string):Observable<League> {
    return this.one(leagueSlug)
      .map((league:League) => {
        if (league === null) {
          console.log('leagues @ league not found:', leagueSlug);

          throw new Error('League not found: ' + leagueSlug);
        }

        return league;
      })
      .catch(_ => Observable.throw(_))
  }

  findWithMembers(leagueSlug:string, leagueTable: boolean):Observable<LeagueMembers> {
    return this.find(leagueSlug)
      .map(league => this.mapLeagueToLeagueHolder(league, this.auth.uid))
      .flatMap((leagueHolder:LeagueHolder) => {
        if (leagueTable) {
          return this.combineLeagueWithTable(leagueHolder);
        }
        return this.combineLeagueWithMembers(leagueHolder);
      });
  }

  private combineLeagueWithTable(leagueHolder:LeagueHolder): Observable<LeagueMembers> {
    return this.individualTable.getLeagueTable(leagueHolder.league.slug)
      .map((tableRows: Array<TableRow>) => {
        return {
          holder: leagueHolder,
          tableRows: tableRows,
          members: []
        };
      });
  }

  private combineLeagueWithMembers(leagueHolder:LeagueHolder) {
    let memberIds = leagueHolder.league.members;

    return this.users.usersOnce$.map(users => {
      let members = _.filter(users, user => {
        return !!memberIds[user.uid];
      });

      return {
        holder: leagueHolder,
        tableRows: [],
        members: _.sortBy(members, 'displayName'),
      };
    });
  }

  redirectToLeagues() {
    return this.router.navigate(['Leagues']);
  }

  redirectToLeague(leagueSlug:string) {
    return this.router.navigate(['LeagueDetails', {'leagueSlug': leagueSlug}]);
  }

  list() {
    return this.af.list('/leagues')
      .map((leagues:Array<League>) => {
        console.log('leagues @ map league item');
        return leagues.map((league:League) => this.mapLeagueToLeagueHolder(league, this.auth.uid));
      })
      .map((leagues:Array<LeagueHolder>) => {
        console.log('leagues @ sort teams');

        return leagues.sort((league1, league2) => {
          let byMembersCount = league2.membersCount - league1.membersCount;
          if (byMembersCount !== 0) {
            return byMembersCount;
          }

          if (league1.league.name > league2.league.name) {
            return 1;
          }
          if (league1.league.name < league2.league.name) {
            return -1;
          }

          return 0;
        });
      })
  }

  mapLeagueToLeagueHolder(league:League, userUid:string) {
    let isInLeague = !!league.members[userUid];
    let isOwner = userUid === league.owner;
    let canLeave = isInLeague && !isOwner;
    let canAlter = isInLeague && isOwner;

    return {
      league: league,
      canShowBanner: !_.isEmpty(league.image) && league.imageModerated,
      membersCount: _.keys(league.members).length,
      actions: {
        canJoin: !isInLeague,
        canLeave: canLeave,
        canAlter: canAlter
      }
    };
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

  update(league:League, previousLeague:League, imageSrc:string):Promise<void> {
    console.log('leagues store @', league, 'will replace', previousLeague);

    delete league['$key'];

    let onDeleteComplete = () => {
      league.members = previousLeague.members;

      return this.save(league, imageSrc);
    };

    return this.ref.child('/leagues').child(previousLeague.slug).remove()
      .then(() => onDeleteComplete());
  }

  save(league:League, imageSrc:string = ''):Promise<void> {
    league.slug = Slugifier.slugify(league.name);
    league.owner = this.auth.uid;
    league.imageModerated = false;
    league.ownerDisplayName = this.auth.user.displayName;
    league.ownerProfileImageURL = this.auth.user.profileImageURL;
    league.createdAt = Date.now();

    if (!league.members) {
      league.members = {};
    }
    league.members[`${league.owner}`] = true;

    var isEmptyImageSrc = _.isEmpty(imageSrc);
    let imageId = !isEmptyImageSrc ? UniqueIdGenerator.generate() : '';
    league.image = imageId;

    var leagueRef = this.ref.child('/leagues').child(league.slug);

    return leagueRef.set(league)
      .then(_ => {
        if (!isEmptyImageSrc) {
          this.ref.child('/leagues_images').child(imageId).set(imageSrc);
        }
      })
      .then(_ => leagueRef.child('members').child(this.auth.uid).set(true))
      .then(_ => this.attachUserLeague(league));
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
    return this.getUserLeague(league).set(true);
  }

  detachUserLeague(league:League) {
    return this.getUserLeague(league).remove();
  }

  getUserLeague(league:League) {
    return this.ref.child(`users/${this.auth.uid}/leagues/${league.slug}`);
  }

}
