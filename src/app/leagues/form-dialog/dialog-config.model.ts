import {MdDialogConfig} from 'ng2-material/components/dialog/dialog_config';

import {League} from '../models/league.models';

export class LeagueFormDialogConfig extends MdDialogConfig {
  league(league:League, editingLeague:League = null, editMode:boolean = false) {
    this.context.league = league;
    this.context.editingLeague = editingLeague;
    this.context.editMode = editMode;

    return this;
  }
}
