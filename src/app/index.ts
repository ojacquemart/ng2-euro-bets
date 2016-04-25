// App
export * from './app.component';

import {APP_CORE_PROVIDERS} from './core';
import {APP_BETS_PROVIDERS} from './bets';

// Application wide providers
export const APP_PROVIDERS = [
  APP_CORE_PROVIDERS,
  APP_BETS_PROVIDERS
];
