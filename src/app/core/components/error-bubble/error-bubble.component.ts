import {Component, Input} from 'angular2/core';

import {ErrorImg} from './error-img.component';

@Component({
  directives: [ErrorImg],
  selector: 'bets-error-bubble',
  template: require('./error-buble.html'),
  styles: [require('./error-bubble.scss')]
})
export class ErrorBubble {
}
