export const DEFAULT_LANG = 'en';

let lang = null;

export class UserLang {

  static getLang() {
    if (lang) {
      return lang;
    }

    var userLang = navigator.language.split('-')[0];
    lang = /(fr|en)/gi.test(userLang) ? userLang : DEFAULT_LANG;

    return lang;
  }

}
