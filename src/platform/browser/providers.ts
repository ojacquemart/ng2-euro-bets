/*
 * These are globally available services in any component or any other service
 */

import {provide, PLATFORM_PIPES} from 'angular2/core';

// Angular 2
import {FORM_PROVIDERS} from 'angular2/common';

// Angular 2 Http
import {HTTP_PROVIDERS, Http} from 'angular2/http';
// Angular 2 Router
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';

// Ng Material 2 while Angular Material 2 provides more features
import {MATERIAL_PROVIDERS} from 'ng2-material/all';

// Nh g Translate
import {TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

const TRANSLATE_PROVIDERS = [TranslateService];

// Angular 2 Material
// import {MdRadioDispatcher} from '@angular2-material/radio/radio_dispatcher';
// const MATERIAL_PROVIDERS = [
//   MdRadioDispatcher
// ];

/*
 * Application Providers/Directives/Pipes
 * providers/directives/pipes that only live in our browser environment
 */
export const APPLICATION_PROVIDERS = [
  ...FORM_PROVIDERS,
  ...HTTP_PROVIDERS,
  ...MATERIAL_PROVIDERS,
  ...TRANSLATE_PROVIDERS,
  ...ROUTER_PROVIDERS,

  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  provide(TranslateLoader, {
    useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
    deps: [Http]
  }),
  provide(PLATFORM_PIPES, {useValue: [TranslatePipe], multi: true})
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
