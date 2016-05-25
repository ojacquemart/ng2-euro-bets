import {APP_FIREBASE_PROVIDERS, APP_AUTH_PROVIDERS} from './services/firebase/index';

import {LoadingState} from './services/loading-state/loading-state.service';
import {Pages} from './services/navigation/pages.service';
import {SettingsService} from './services/settings/settings.service';
import {SidenavLayoutCmp} from './components/sidenav-layout/sidenav-layout.component';
import {UsersService} from "./services/users/users.service";

export const APP_CORE_PROVIDERS = [
  APP_FIREBASE_PROVIDERS,
  APP_AUTH_PROVIDERS,
  Pages,
  LoadingState,
  SettingsService,
  SidenavLayoutCmp,
  UsersService
];
