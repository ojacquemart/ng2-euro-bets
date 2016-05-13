import {Component, Input, ElementRef} from 'angular2/core';
import {FORM_DIRECTIVES, Control, ControlGroup, FormBuilder, Validators} from 'angular2/common';

import {Observable} from 'rxjs/Observable';

import {MdDialog, MdDialogRef, Media} from 'ng2-material/all';

import {LoadingState} from '../core/services/loading-state/loading-state.service';
import {Page} from '../core/services/page-title/page.model';
import {PageTitle} from '../core/services/page-title/page-title.service';
import {League} from '../leagues/models/league.models';
import {LeaguesStore} from './services/leagues-store.service';
import {LeagueHolder} from './models/league.models';
import {LeagueDeleteDialogCmp} from './delete-dialog/delete-dialog.component';
import {LeagueDeleteDialogConfig} from './delete-dialog/delete-dialog-config.model';

const PAGE:Page = {title: 'Leagues'};
const TIMEOUT_VALIDATION_LEAGUE_NAME = 750;

@Component({
  template: require('./leagues.html'),
  styles: [require('./leagues.scss')],
  directives: [FORM_DIRECTIVES],
  providers: [LeaguesStore]
})
export class LeaguesCmp {

  private loading = false;
  private loadingStateSubscription;

  private projectForm:ControlGroup;
  private showingForm:boolean;

  private leagues$:Observable<Array<LeagueHolder>>;

  constructor(public dialog:MdDialog, public element:ElementRef,
              private leaguesStore:LeaguesStore, loadingState:LoadingState,
              pageTitle:PageTitle, fb:FormBuilder) {
    console.log('leagues @ init');

    this.loadingStateSubscription = loadingState.subscribe((loading:boolean) => {
      this.loading = loading;
    });

    pageTitle.emit(PAGE);

    this.projectForm = fb.group({
      name: ['', Validators.required,
        (control:Control) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              let leagueName = control.value;
              leaguesStore.validateExists(leagueName, resolve);
            }, TIMEOUT_VALIDATION_LEAGUE_NAME);
          });
        }
      ],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(30)])]
    });
  }

  save() {
    let league:League = this.projectForm.value;
    console.log('leagues @ save', league);

    let self = this;
    this.leaguesStore.save(league, () => self.resetForm());
  }

  private resetForm() {
    _.each(this.projectForm.controls, (control:Control)=> {
      control.updateValue('');
      control.setErrors(null);
    });
    this.showingForm = false;
  }

  showDeleteConfirm(league:League, ev) {
    let config = new LeagueDeleteDialogConfig()
      .leagueName(league.name)
      .clickOutsideToClose(true)
      .targetEvent(ev);


    this.dialog.open(LeagueDeleteDialogCmp, this.element, config)
      .then((ref:MdDialogRef) => {
        ref.whenClosed.then((confirmed) => {
          if (confirmed) {
            this.leaguesStore.delete(league);
          }
        })
      });
  }

  leave(league:League) {
    console.log('leagues @ leave', league);

    this.leaguesStore.leave(league);
  }

  delete(league:League) {
    console.log('leagues @ delete', league);

    this.leaguesStore.delete(league);
  }

  join(league:League) {
    console.log('leagues @ join', league);

    this.leaguesStore.join(league);
  }

  ngOnInit() {
    console.log('leagues @ ngOnInit');

    this.leagues$ = this.leaguesStore.list();
  }

  ngOnDestroy() {
    if (this.loadingStateSubscription) {
      this.loadingStateSubscription.unsubscribe();
    }
  }

}


