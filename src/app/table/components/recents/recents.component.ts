import {Component, Input} from 'angular2/core';

@Component({
  selector: 'user-recents',
  styles: [require('./recents.scss')],
  template: require('./recents.html')
})
export class RecentsCmp {

  @Input()
  private recents: Array<number>;

}
