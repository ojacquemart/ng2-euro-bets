import {APP_FIREBASE_PROVIDERS, APP_AUTH_PROVIDERS} from './services/firebase/index';

import {PageTitle} from './services/page-title/page-title.service';
import {LoadingState} from './services/loading-state/loading-state.service';
import {SidenavLayoutCmp} from './components/sidenav-layout/sidenav-layout.component';

export const APP_CORE_PROVIDERS = [
  APP_FIREBASE_PROVIDERS,
  APP_AUTH_PROVIDERS,
  PageTitle,
  LoadingState,
  SidenavLayoutCmp
];
