import {Component, Input} from 'angular2/core';

@Component({
  selector: 'bets-uefa-euro-logo',
  template: require('./uefa-euro-logo.html'),
  styles: [require('./uefa-euro-logo.scss')]
})
export class UefaEuroLogoCmp {
  @Input()
  private size: string;
}
