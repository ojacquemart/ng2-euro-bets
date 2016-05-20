import {Component} from 'angular2/core';
import {RANDOM_NUMBER_GENERATOR} from '../../services/util/random-number-generator.helper';

const PLAYERS = ['benzema', 'valbuena', 'ribery', 'deschamps', 'zidane'];

@Component({
  selector: 'bets-error-img',
  template: '<img [src]="imgUrl" />'
})
export class ErrorImg {

  private imgUrl: string;

  constructor() {
    let playerIndex = RANDOM_NUMBER_GENERATOR.generate(PLAYERS.length);
    let playerName = PLAYERS[playerIndex];

    this.imgUrl = `assets/img/players/${playerName}.png`;
  }

}
