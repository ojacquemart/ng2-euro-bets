import {UserLang} from '../../core/services/util/user-lang.helper';

const LABELS = {
  fr: {
    SIGN_IN: 'Se connecter',
    SIGN_UP: 'S\'enregistrer',
    NAME: 'Nom',
    EMAIL: 'Email',
    PASSWORD: 'Mot de passe'
  },
  en: {
    SIGN_IN: 'Sign in',
    SIGN_UP: 'Sign up',
    NAME: 'Name',
    EMAIL: 'Email',
    PASSWORD: 'Password'
  }
};

export class LoginLabels {

  static getLabels() {
    return LABELS[UserLang.getLang()];
  }

}
