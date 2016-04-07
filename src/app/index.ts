// App
export * from './app.component';

import {Auth} from './core/services/firebase/auth.service';
import {OnLoginLogger} from './core/services/firebase/on-login-logger.service';

// Application wide providers
export const APP_PROVIDERS = [
  Auth, OnLoginLogger
];
