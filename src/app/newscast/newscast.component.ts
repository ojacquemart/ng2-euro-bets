import {Component} from 'angular2/core';

import {Pages, Page} from '../core/services/navigation/pages.service';
import {StatsFetcher} from "./services/stats-fetcher.service";
import {BetCardListItemCmp} from "../bets/card-list-item/card-list-item.component";
import {FlagIcon} from "../core/components/flag-icon/flag-icon.component";

@Component({
  directives: [FlagIcon, BetCardListItemCmp],
  styles: [require('./newscast.scss')],
  template: require('./newscast.html')
})
export class NewscastCmp {

  private loading = true;
  private stats$;

  constructor(private statsFetcher:StatsFetcher, private pages:Pages) {
    console.log('newscast @ init');
  }

  ngOnInit() {
    console.log('newscast @ ngOnInit');

    this.pages.emit(Page.NEWSCAST);

    this.stats$ = this.statsFetcher.getStats()
      .do(() => this.loading = false);
  }

}
