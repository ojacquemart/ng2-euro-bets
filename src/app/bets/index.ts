import {MatchesService} from './services/matches.service';
import {GroupsService} from './services/groups.service';
import {WinnerService} from './services/winner.service';
import {BetsService} from './services/bets.service';
import {CountriesService} from './services/countries.service';

export const APP_BETS_PROVIDERS = [
  MatchesService, GroupsService, WinnerService, BetsService, CountriesService
];
