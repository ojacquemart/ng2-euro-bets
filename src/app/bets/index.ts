import {BetsStore} from './services/bets.store.service';
import {UserBetsStore} from './services/user-bets.store.service';

export const APP_BETS_PROVIDERS = [
  BetsStore, UserBetsStore
];
