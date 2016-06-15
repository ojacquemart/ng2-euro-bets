import {Injectable} from 'angular2/core';

import {AngularFire, FirebaseObjectObservable} from 'angularfire2/angularfire2';
import {Observable} from 'rxjs/Observable';

export const DAY_ID_GROUP_PHASE = 3;

export interface SettingsGroup {
  dayId: number;
  started: boolean;
  phase: string;
  leagueTable: boolean;
}

@Injectable()
export class SettingsService {

  settings$:FirebaseObjectObservable<SettingsGroup>;

  constructor(private af:AngularFire) {
    console.log('settings @ init');

    this.settings$ = this.af.object('/settings');
  }

}
