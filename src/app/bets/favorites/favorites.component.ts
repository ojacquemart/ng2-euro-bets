import {Component, ViewEncapsulation} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {FlagIcon} from '../../core/components/flag-icon/flag-icon.component';
import {UefaEuroLogoCmp} from '../../core/components/uefa-euro-logo/uefa-euro-logo.component';
import {BetsStore} from '../services/bets.store.service';
import {UserBetsStore} from '../services/user-bets.store.service';
import {Country, CountryFavorite} from "../models/bets.models";
import {FavoriteCountryCardItemCmp} from './card/country-card-item.component';

@Component({
  directives: [FavoriteCountryCardItemCmp, FlagIcon, UefaEuroLogoCmp],
  template: require('./favorites.html'),
  styles: [require('./favorites.scss')],
  encapsulation: ViewEncapsulation.None,
})
export class FavoritesBetsCmp {

  private countries:Array<Country>;
  private favorite:Country;

  constructor(private betsStore:BetsStore, private userBetsStore:UserBetsStore) {
    console.log('favorites bets @ init');
  }

  ngOnInit() {
    this.betsStore.getCountries()
      .subscribe((countryFavorite:CountryFavorite) => {
        this.countries = countryFavorite.countries;
        this.favorite = countryFavorite.favorite;
      });
  }

  saveCountry(country:Country) {
    let onSuccess = () => {
      this.favorite = country;
    };

    this.userBetsStore.saveCountry(country, onSuccess);
  }

}
