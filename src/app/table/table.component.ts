import {Component} from 'angular2/core';
import {RouteData} from 'angular2/router';

import {Pages} from "../core/services/navigation/pages.service";
import {Page} from "../core/services/navigation/pages.service";

@Component({
  directives: [],
  template: require('./table.html'),
  styles: [require('./table.scss')]
})
export class TableCmp {

  constructor(pages: Pages) {
    console.log('table @ init');

    pages.emit(Page.TABLE);
  }

  ngOnInit() {
    console.log('table @ ngOnInit');
  }

}
