// App
export * from './app.component';

import {APP_CORE_PROVIDERS} from './core';
import {APP_BETS_PROVIDERS} from './bets';
import {APP_LEAGUES_PROVIDERS} from './leagues';
import {APP_TABLES_PROVIDERS} from './table';

// Application wide providers
export const APP_PROVIDERS = [
  ...APP_CORE_PROVIDERS,
  ...APP_BETS_PROVIDERS,
  ...APP_LEAGUES_PROVIDERS,
  ...APP_TABLES_PROVIDERS
];
