import {Component, Input} from 'angular2/core';

import {ScoreErrorImg} from './score-error-img.component';

@Component({
  directives: [ScoreErrorImg],
  selector: 'bets-score-error-message',
  template: require('./score-error-message.html'),
  styles: [require('./score-error-message.scss')]
})
export class ScoreErrorMessage {
}
