import {Component} from 'angular2/core';

@Component({
  directives: [],
  template: `
      Table

      TODO

  `
})
export class TableCmp {

  constructor() {
    console.log('table @ init');
  }

  ngOnInit() {
    console.log('table @ ngOnInit');
  }
}
