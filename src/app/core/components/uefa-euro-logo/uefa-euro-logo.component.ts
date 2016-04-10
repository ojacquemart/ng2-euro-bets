import {Component, Input} from 'angular2/core';

@Component({
  selector: 'pronos-uefa-euro-logo',
  styles: [require('./uefa-euro-logo.scss')],
  template: require('./uefa-euro-logo.html')
})
export class UefaEuroLogo {
  @Input()
  private size: string;
}
