import {Component, Input} from 'angular2/core';

import {News} from '../services/newscast-center.service';

@Component({
  selector: 'newscast-news-item',
  styles: [require('./news-item.scss')],
  template: require('./news-item.html')
})
export class NewsItemCmp {
  @Input()
  private news:News;
}
