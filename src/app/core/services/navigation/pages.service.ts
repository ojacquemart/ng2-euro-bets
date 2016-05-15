import {EventEmitter, Injectable} from 'angular2/core';

import {TranslateService} from 'ng2-translate/ng2-translate';
import {Observable} from 'rxjs/Observable';

export const PAGES:Array<PageComponent> = [
  {key: 'BETS', pathStart: 'bets', linkParams: ['Bets']},
  {key: 'TABLES', pathStart: 'table', linkParams: ['Table']},
  {key: 'LEAGUES', pathStart: 'leagues', linkParams: ['Leagues']}
];

export interface PageComponent {
  key: string;
  title?: string;
  pathStart: string;
  linkParams: Array<string>;
}

export enum Page {
  BETS,
  TABLE,
  LEAGUES
}

@Injectable()
export class Pages {

  private page$:EventEmitter<string> = new EventEmitter<string>();

  constructor(private translate:TranslateService) {
  }

  getPage(pageComponent:PageComponent) {
    return this.translate.get('SIDENAV.PAGES')
      .map((translations) => {
        return translations[pageComponent.key];
      });
  }

  getPages():Observable<Array<PageComponent>> {
    console.log('pages @ get pages');

    return this.translate.get('SIDENAV.PAGES')
      .map((translations) => {
        return PAGES.map((page:PageComponent) => {
          page.title = translations[page.key];

          return page;
        });
      });
  }

  emit(page:Page) {
    this.getPage(PAGES[page])
      .subscribe((pageTitle:string) => {
        this.page$.emit(pageTitle);
      });
  }

  subscribe(subscriber:(pageTitle:string) => void) {
    this.page$.subscribe(subscriber);
  };

}
