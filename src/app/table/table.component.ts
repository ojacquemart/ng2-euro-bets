import {Component} from 'angular2/core';
import {RouteData} from "angular2/router";

import {Page, PageTitle} from '../core/services/page-title';

const PAGE: Page = {title: 'Table'};

@Component({
  directives: [],
  template: `
      Table

      TODO
  `
})
export class TableCmp {

  constructor(pageTitle: PageTitle) {
    console.log('table @ init');

    pageTitle.emit(PAGE);
  }

  ngOnInit() {
    console.log('table @ ngOnInit');
  }
}
