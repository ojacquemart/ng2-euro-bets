import {Injectable} from "angular2/core";

import {Observable} from "rxjs/Observable";
import {AngularFire} from "angularfire2/angularfire2";
import {FirebaseObjectObservable} from "angularfire2/angularfire2";

export interface SettingsGroup {
  dayId: number;
  started: boolean;
  phase: string;
}

@Injectable()
export class SettingsService {

  settings$:FirebaseObjectObservable<SettingsGroup>;

  constructor(private af:AngularFire) {
    console.log('settings @ init');

    this.settings$ = this.af.object('/settings');
  }

}
