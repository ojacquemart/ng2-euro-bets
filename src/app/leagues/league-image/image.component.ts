import {Component, Input, ViewEncapsulation} from 'angular2/core';

import {LeaguesStore} from '../services/leagues-store.service';
import {ChangeDetectionStrategy} from "angular2/core";
import {ApplicationRef} from "angular2/core";
import {ChangeDetectorRef} from "angular2/core";

@Component({
  selector: 'league-image',
  styles: [require('./image.scss')],
  template: require('./image.html')
})
export class LeagueImgCmp {

  @Input() imageRef;
  @Input() size;

  private loading = true;
  private imageSubscription;
  private image:string;

  constructor(private leaguesStore:LeaguesStore) {
  }

  ngOnInit() {
    this.loading = true;
    this.imageSubscription = this.leaguesStore.image(this.imageRef)
      .subscribe(image => {
        this.image = image;
        this.loading = false;
      });
  }

  ngOnDestroy() {
    if (this.imageSubscription) {
      this.imageSubscription.unsubscribe();
      this.imageSubscription = null;
    }
  }

}
