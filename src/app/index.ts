// App
export * from './app.component';

import {Title} from 'angular2/platform/browser';

import {Auth} from './core/services/firebase/auth.service';
import {OnLoginLogger} from './core/services/firebase/on-login-logger.service';
import {PageTitle} from './core/services/page-title/page-title.service';
import {SidenavLayoutCmp} from './core/components/sidenav-layout/sidenav-layout.component';

// Application wide providers
export const APP_PROVIDERS = [
  Auth, OnLoginLogger,
  PageTitle,
  SidenavLayoutCmp
];
