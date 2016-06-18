import {EventEmitter, Injectable} from 'angular2/core';

import {TranslateService} from 'ng2-translate/ng2-translate';
import {Observable} from 'rxjs/Observable';

export const PAGES:Array<PageComponent> = [
  {key: 'NEWSCAST', pathStart: 'news', linkParams: ['Newscast']},
  {key: 'BETS', pathStart: 'bets', linkParams: ['Bets']},
  {key: 'TABLES', pathStart: 'table', linkParams: ['Table']},
  {key: 'LEAGUES', pathStart: 'leagues', linkParams: ['Leagues']},
  {key: 'HELP', divider: true, pathStart: 'help', linkParams: ['Help']}
];

export interface PageComponent {
  key: string;
  title?: string;
  divider?:boolean;
  pathStart: string;
  linkParams: Array<string>;
}

export enum Page {
  NEWSCAST,
  BETS,
  TABLE,
  LEAGUES,
  HELP
}

@Injectable()
export class Pages {

  private page$:EventEmitter<PageComponent> = new EventEmitter<PageComponent>();

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
    let pageComponent = PAGES[page];
    this.getPage(pageComponent)
      .subscribe((pageTitle:string) => {
        pageComponent.title = pageTitle;
        this.emitPage(pageComponent);
      });
  }

  emitPage(page:PageComponent) {
    this.page$.emit(page);

    if (window.pageYOffset > 0) {
      console.log('pages @ scroll to (0, 0)');
      window.scrollTo(0, 0);
    }
  }

  subscribe(subscriber:(page:PageComponent) => void) {
    this.page$.subscribe(subscriber);
  };

}
