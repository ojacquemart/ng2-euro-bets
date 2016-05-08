import {Component, Input} from 'angular2/core';

@Component({
  selector: 'flag-icon',
  template: `<span class="flag-icon" [ngClass]="'flag-icon-' + code"></span>`,
  styles: [
    `
    .flag-icon {
      border: 1px solid #EFEBEB;
    }

    .flag-icon-gb-nir {
      background-image: url('assets/img/flags/flag-gb-nir.svg');
    }
  `
  ],
})
export class FlagIcon {
  @Input()
  private code:String;
}
