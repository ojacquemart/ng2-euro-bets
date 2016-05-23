import {Component, ViewEncapsulation} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {UserLang} from '../../core/services/util/user-lang.helper';
import {RANDOM_NUMBER_GENERATOR} from '../../core/services/util/random-number-generator.helper';
import {FlagIcon} from '../../core/components/flag-icon/flag-icon.component';
import {UefaEuroLogoCmp} from '../../core/components/uefa-euro-logo/uefa-euro-logo.component';

import {BetsService} from '../services/bets.service';
import {WinnerService} from '../services/winner.service';
import {Country, CountryWinner} from '../models/bets.models';
import {WinnerCountryCardItemCmp} from './card/country-card-item.component';

@Component({
  directives: [WinnerCountryCardItemCmp, FlagIcon, UefaEuroLogoCmp],
  template: require('./winner.html'),
  styles: [require('./winner.scss')],
  encapsulation: ViewEncapsulation.None,
})
export class WinnerBetsCmp {

  private countryWinner:CountryWinner;
  private lang;

  constructor(private bets: BetsService, private winner:WinnerService) {
    console.log('favorites bets @ init');

    this.lang = UserLang.getLang();
  }

  ngOnInit() {
    this.winner.getWinner()
      .subscribe((countryFavorite:CountryWinner) => {
        this.countryWinner = countryFavorite;
      });
  }

  imFeelingLucky() {
    let countryIndex = RANDOM_NUMBER_GENERATOR.generate(this.countryWinner.countries.length);
    let country = this.countryWinner.countries[countryIndex];

    this.saveCountry(country);
  }

  saveCountry(country:Country) {
    let onSuccess = () => {
      this.countryWinner.userWinner = country;
    };

    this.bets.saveCountry(country, onSuccess);
  }

}
