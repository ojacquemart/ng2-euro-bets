import {Component, Input} from 'angular2/core';
import {MdDialogRef} from 'ng2-material/components/dialog/dialog_ref';

@Component({
  template: require('./delete-dialog.html'),
  styles: [require('./delete-dialog.scss')]
})
export class LeagueDeleteDialogCmp {

  @Input() leagueName:string;
  leagueNameConfirm:string;

  constructor(private dialog:MdDialogRef) {
  }

}
