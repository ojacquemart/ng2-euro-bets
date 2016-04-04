import {Component} from 'angular2/core';

@Component({
  template: require('./login.html')
})
export class LoginCmp {

  constructor() {
    console.log('login#init');
  }

  ngOnInit() {
    console.log('login#ngOnInit');
  }

}
