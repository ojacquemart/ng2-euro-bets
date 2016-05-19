import {Component, Input} from 'angular2/core';
import {MdDialogRef} from 'ng2-material/components/dialog/dialog_ref';

import {League} from '../models/league.models';

@Component({
  template: require('./delete-dialog.html'),
  styles: [require('./delete-dialog.scss')]
})
export class LeagueDeleteDialogCmp {

  @Input() league:League;
  leagueNameConfirm:string;

  constructor(private dialog:MdDialogRef) {
  }

}
