import {Component, EventEmitter, ElementRef, Injectable, Input, Output} from 'angular2/core';
import {Router} from 'angular2/router';

import {MdDialog, MdDialogRef, Media} from 'ng2-material/all';

import {LeagueHolder} from '../models/league.models';
import {League} from '../models/league.models';

import {LeaguesStore} from '../services/leagues-store.service';
import {LeagueInviteDialogCmp} from '../invite-dialog/invite-dialog.component';
import {LeagueDialogConfig} from '../delete-dialog/dialog-config.model';
import {LeagueDeleteDialogCmp} from '../delete-dialog/delete-dialog.component';
import {LeagueFormDialogCmp} from "../form-dialog/form-dialog.component";
import {LeagueFormDialogConfig} from "../form-dialog/dialog-config.model";

@Injectable()
export class LeagueActionsHandler {

  constructor(public dialog:MdDialog, private leaguesStore:LeaguesStore, private router:Router) {
    console.log('league actions @ init');
  }

  show(league:League) {
    return this.leaguesStore.redirectToLeague(league.slug);
  }

  create(elementRef:ElementRef, $event) {
    console.log('league actions @ create');

    let config = new LeagueFormDialogConfig()
      .league(new League())
      .clickOutsideToClose(true)
      .targetEvent($event);

    this.dialog.open(LeagueFormDialogCmp, elementRef, config)
      .then((ref:MdDialogRef) => {
        ref.whenClosed.then(() => {
          console.log('close');
        })
      });
  }

  edit(league:League, elementRef:ElementRef, $event) {
    console.log('leagues @ edit', league);

    let leagueToEdit = _.clone(league);
    let config = new LeagueFormDialogConfig()
      .league(leagueToEdit, league, true)
      .clickOutsideToClose(true)
      .targetEvent($event);

    return this.dialog.open(LeagueFormDialogCmp, elementRef, config)
      .then((ref:MdDialogRef) => {
        return ref.whenClosed.then((edited) => {
          console.log('close');
          if (!!edited) {
            return leagueToEdit;
          }

          return null;
        });
      });
  }

  invite(league:League, elementRef:ElementRef, $event) {
    console.log('league actions @ invite', league);

    let config = new LeagueDialogConfig()
      .league(league)
      .clickOutsideToClose(true)
      .targetEvent($event);

    this.dialog.open(LeagueInviteDialogCmp, elementRef, config)
      .then((ref:MdDialogRef) => {
        ref.whenClosed.then(() => {
          console.log('close');
        })
      });
  }

  join(league:League) {
    console.log('league actions @ join', league);

    this.leaguesStore.join(league);
  }

  leave(league:League) {
    console.log('league actions @ leave', league);

    this.leaguesStore.leave(league);
  }

  delete(league:League, elementRef:ElementRef, $event) {
    console.log('league actions @ delete', league);

    let config = new LeagueDialogConfig()
      .league(league)
      .clickOutsideToClose(true)
      .targetEvent($event);

    this.dialog.open(LeagueDeleteDialogCmp, elementRef, config)
      .then((ref:MdDialogRef) => {
        ref.whenClosed.then((confirmed) => {
          if (confirmed) {
            this.leaguesStore.delete(league);
          }
        })
      });
  }

}
