import {Component, EventEmitter, ElementRef, Input, Output} from 'angular2/core';

import {MdDialog, MdDialogRef, Media} from 'ng2-material/all';

import {LeagueHolder} from '../models/league.models';
import {League} from '../models/league.models';

import {LeaguesStore} from '../services/leagues-store.service';
import {LeagueInviteDialogCmp} from '../invite-dialog/invite-dialog.component';
import {LeagueDialogConfig} from '../delete-dialog/dialog-config.model';
import {LeagueDeleteDialogCmp} from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'league-card-item',
  template: require('./league-card-item.html'),
  styles: [require('./league-card-item.scss')],
})
export class LeagueCardItemCmp {
  @Input()
  private leagueHolder:LeagueHolder;
  @Input()
  private elementRef: ElementRef;
  @Output()
  private onEdit = new EventEmitter<League>();

  constructor(public dialog:MdDialog, private leaguesStore:LeaguesStore) {
  }

  invite(league:League, ev) {
    console.log('league card @ invite', league);

    let config = new LeagueDialogConfig()
      .league(league)
      .clickOutsideToClose(true)
      .targetEvent(ev);

    this.dialog.open(LeagueInviteDialogCmp, this.elementRef, config)
      .then((ref:MdDialogRef) => {
        ref.whenClosed.then(() => {
          console.log('close');
        })
      });
  }

  leave(league:League) {
    console.log('league card @ leave', league);

    this.leaguesStore.leave(league);
  }

  join(league:League) {
    console.log('league card @ join', league);

    this.leaguesStore.join(league);
  }

  edit(league:League) {
    console.log('league card @ edit', league);

    this.onEdit.emit(league);
  }

  deleteConfirm(league:League, ev) {
    console.log('league card @ delete', league);

    let config = new LeagueDialogConfig()
      .league(league)
      .clickOutsideToClose(true)
      .targetEvent(ev);

    this.dialog.open(LeagueDeleteDialogCmp, this.elementRef, config)
      .then((ref:MdDialogRef) => {
        ref.whenClosed.then((confirmed) => {
          if (confirmed) {
            this.leaguesStore.delete(league);
          }
        })
      });
  }

}
