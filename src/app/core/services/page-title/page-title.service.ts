import {EventEmitter} from 'angular2/core';

import {Page} from './page.model';

export class PageTitle {

  private page$:EventEmitter<Page> = new EventEmitter<Page>();

  emit(page:Page) {
    this.page$.emit(page);
  }

  subscribe(subscriber: (page: Page) => void) {
    this.page$.subscribe(subscriber);
  };

}
