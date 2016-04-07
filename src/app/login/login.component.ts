import {Component} from 'angular2/core';
import {Auth} from "../core/services/firebase/auth.service";

@Component({
  template: require('./login.html')
})
export class LoginCmp {

  constructor(private auth: Auth) {
    console.log('login#init');
  }

  login(provider: string) {
    this.auth.login(provider);
  }

  ngOnInit() {
    console.log('login#ngOnInit');
  }

}
