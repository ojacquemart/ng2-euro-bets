import {Component, Input} from 'angular2/core';

@Component({
  selector: 'arrow-evolution',
  styles: [require('./arrow-evolution.scss')],
  template: require('./arrow-evolution.html')
})
export class ArrowEvolutionCmp {

  @Input()
  private evolution: number = 0;

}
