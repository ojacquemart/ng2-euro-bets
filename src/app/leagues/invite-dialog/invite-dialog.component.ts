import {Component, Input} from 'angular2/core';
import {MdDialogRef} from 'ng2-material/components/dialog/dialog_ref';

import {UniqueIdGenerator} from '../../core/services/util/unique-id-generator.helper';

import {LeaguesStore} from '../services/leagues-store.service';
import {League} from '../models/league.models';

@Component({
  template: require('./invite-dialog.html'),
  styles: [require('./invite-dialog.scss')]
})
export class LeagueInviteDialogCmp {

  @Input() league:League;
  private invitationLink:string;

  constructor(private dialog:MdDialogRef, private leaguesStore:LeaguesStore) {
  }

  generateInvitationCode() {
    let invitationCode = UniqueIdGenerator.generate();

    this.leaguesStore.attachInvitationCode(this.league, invitationCode)
      .then(() => {
        this.league.invitationCode = invitationCode;
        this.setInvitationLink();
      });
  }

  private setInvitationLink() {
    this.invitationLink = `${window.location.origin}/#/leagues/${this.league.slug}/invitations/${this.league.invitationCode}`;
  }

  ngOnInit() {
    this.setInvitationLink();
  }

}
