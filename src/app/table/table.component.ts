import {Component} from 'angular2/core';

import {SidenavLayout} from '../core/components/sidenav-layout/sidenav-layout.component'

@Component({
  directives: [SidenavLayout],
  template: `
      <pronos-sidenav-layout>
      Table

      TODO
      </pronos-sidenav-layout>

  `
})
export class TableCmp {

  constructor() {
    console.log('table#init');
  }

  ngOnInit() {
    console.log('table#ngOnInit');
  }
}
