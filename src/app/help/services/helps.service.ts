import {Injectable} from 'angular2/core';

import {AngularFire} from 'angularfire2/angularfire2';
import {Observable} from 'rxjs/Observable';

import {I18n} from '../../core/models/i18n.model';

interface HelpSection {
  title: I18n,
  content: I18n
}

@Injectable()
export class HelpsService {

  sections$:Observable<Array<I18n>>;

  constructor(af:AngularFire) {
    console.log('helps @ init');

    this.sections$ = af.object('/help/sections');
  }

}
