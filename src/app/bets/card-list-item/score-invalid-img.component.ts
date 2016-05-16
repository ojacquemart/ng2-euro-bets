import {Component} from 'angular2/core';
import {RANDOM_NUMBER_GENERATOR} from '../../core/services/util/random-number-generator.helper';

const PLAYERS = ['benzema', 'valbuena', 'ribery', 'deschamps', 'zidane'];

@Component({
  selector: 'bets-score-invalid-img',
  template: '<img [src]="imgUrl" />'
})
export class InvalidScorepicture {

  private imgUrl: string;

  constructor() {
    let rndIndex = RANDOM_NUMBER_GENERATOR.generate(PLAYERS.length);
    let playerImg = PLAYERS[rndIndex];

    this.imgUrl = `assets/img/players/${playerImg}.png`;
  }

}
