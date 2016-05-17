import {Component} from 'angular2/core';
import {RANDOM_NUMBER_GENERATOR} from '../../core/services/util/random-number-generator.helper';

const PLAYERS = ['benzema', 'valbuena', 'ribery', 'deschamps', 'zidane'];

@Component({
  selector: 'bets-score-error-img',
  template: '<img [src]="imgUrl" />'
})
export class ScoreErrorImg {

  private imgUrl: string;

  constructor() {
    let playerIndex = RANDOM_NUMBER_GENERATOR.generate(PLAYERS.length);
    let playerName = PLAYERS[playerIndex];

    this.imgUrl = `assets/img/players/${playerName}.png`;
  }

}
