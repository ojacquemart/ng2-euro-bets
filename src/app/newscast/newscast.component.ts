import {Component} from 'angular2/core';

import {FlagIcon} from "../core/components/flag-icon/flag-icon.component";
import {Pages, Page} from '../core/services/navigation/pages.service';

import {BetCardListItemCmp} from "../bets/card-list-item/card-list-item.component";

import {NewscastCenter} from "./services/newscast-center.service";

import {NewsItemCmp} from "./news-item/news-item.component";
import {StatItemCmp} from "./stat-item/stat-item.component";

@Component({
  directives: [FlagIcon, BetCardListItemCmp, NewsItemCmp, StatItemCmp],
  styles: [require('./newscast.scss')],
  template: require('./newscast.html')
})
export class NewscastCmp {

  private loading = true;
  private stats$;

  constructor(private statsFetcher:NewscastCenter, private pages:Pages) {
    console.log('newscast @ init');
  }

  ngOnInit() {
    console.log('newscast @ ngOnInit');

    this.pages.emit(Page.NEWSCAST);

    this.stats$ = this.statsFetcher.getNewscast()
      .do(() => this.loading = false);
  }

}
