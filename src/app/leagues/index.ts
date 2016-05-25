import {LeaguesStore} from './services/leagues-store.service';
import {LeagueActionsHandler} from './services/league-actions-handler.service';

export const APP_LEAGUES_PROVIDERS = [
  LeagueActionsHandler,
  LeaguesStore
];

