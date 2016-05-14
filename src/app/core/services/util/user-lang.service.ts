export const DEFAULT_LANG = 'en';

export class UserLang {

  static getLang() {
    var userLang = navigator.language.split('-')[0];

    return /(fr|en)/gi.test(userLang) ? userLang : DEFAULT_LANG;
  }

}
