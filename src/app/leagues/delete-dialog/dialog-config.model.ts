import {MdDialogConfig} from 'ng2-material/components/dialog/dialog_config';

import {League} from '../models/league.models';

export class LeagueDialogConfig extends MdDialogConfig {
  league(league:League) {
    this.context.league = league;
    return this;
  }
}
