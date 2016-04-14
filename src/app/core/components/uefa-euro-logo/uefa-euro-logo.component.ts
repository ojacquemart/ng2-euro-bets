import {Component, Input} from 'angular2/core';

@Component({
  selector: 'bets-uefa-euro-logo',
  styles: [require('./uefa-euro-logo.scss')],
  template: require('./uefa-euro-logo.html')
})
export class UefaEuroLogoCmp {
  @Input()
  private size: string;
}
