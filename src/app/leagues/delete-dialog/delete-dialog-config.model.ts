import {MdDialogConfig} from 'ng2-material/components/dialog/dialog_config';

export class LeagueDeleteDialogConfig extends MdDialogConfig {
  leagueName(name:string) {
    this.context.leagueName = name;
    return this;
  }
}
