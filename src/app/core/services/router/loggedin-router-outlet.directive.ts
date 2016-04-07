import {Directive, Attribute, ElementRef, DynamicComponentLoader} from 'angular2/core';
import {Router, RouterOutlet, ComponentInstruction} from 'angular2/router';

import {Auth} from "../firebase/auth.service";

/**
 * Inspired by https://github.com/auth0/angular2-authentication-sample
 */
@Directive({
  selector: 'auth-router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
  private publicRoutes:any = {
    login: true
  };

  private router:Router;
  private auth:Auth;

  constructor(elementRef:ElementRef, loader:DynamicComponentLoader, router:Router,
              @Attribute('name') nameAttr:string,
              auth:Auth) {
    super(elementRef, loader, router, nameAttr);

    console.log('???');
    this.router = router;
    this.auth = auth;
  }

  activate(instruction:ComponentInstruction) {
    console.log('???');
    if (this.cannotActivateRoute(instruction)) {
      this.auth.navigateToLogin();
    }

    return super.activate(instruction);
  }

  private cannotActivateRoute(instruction:ComponentInstruction) {
    var url = instruction.urlPath;

    return !this.publicRoutes[url] && !this.auth.authenticated
  }

}
