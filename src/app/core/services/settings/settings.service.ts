import {Injectable} from "angular2/core";

import {Observable} from "rxjs/Observable";
import {AngularFire} from "angularfire2/angularfire2";

export interface SettingsGroup {
  dayId: number;
  started: boolean;
  phase: string;
}

@Injectable()
export class Settings {

  constructor(private af:AngularFire) {
    console.log('settings @ init');
  }

  getSetings$():Observable<SettingsGroup> {
    console.log('settings @ get settings$');

    return this.af.object('/settings');
  }

}
