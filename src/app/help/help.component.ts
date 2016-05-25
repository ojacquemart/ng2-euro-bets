import {Component, ViewEncapsulation} from 'angular2/core';

import {Pages} from '../core/services/navigation/pages.service';
import {Page} from '../core/services/navigation/pages.service';
import {LoadingState} from '../core/services/loading-state/loading-state.service';
import {UserLang} from '../core/services/util/user-lang.helper';

import {HelpsService} from './services/helps.service';

@Component({
  providers: [HelpsService],
  styles: [require('./help.scss')],
  template: require('./help.html'),
  encapsulation: ViewEncapsulation.None,
})
export class HelpCmp {

  private sections$;
  private loading;
  private lang;

  constructor(pages:Pages, private helps:HelpsService) {
    console.log('help @ init');

    this.lang = UserLang.getLang();
    pages.emit(Page.HELP);
  }

  ngOnInit() {
    console.log('help @ ngOnInit');

    this.loading = true;
    this.sections$ = this.helps.sections$.do(_ => this.loading = false);
  }

}
