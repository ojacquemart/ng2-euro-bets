import {ApplicationRef, Component, Input, ElementRef} from 'angular2/core';
import {FORM_DIRECTIVES, Control, ControlGroup, FormBuilder, Validators} from 'angular2/common';

import {Observable} from 'rxjs/Observable';

import {MdDialog, MdDialogRef, Media} from 'ng2-material/all';

import {LoadingState} from '../core/services/loading-state/loading-state.service';
import {League} from '../leagues/models/league.models';
import {LeaguesStore} from './services/leagues-store.service';
import {LeagueHolder} from './models/league.models';
import {LeagueDeleteDialogCmp} from './delete-dialog/delete-dialog.component';
import {LeagueDeleteDialogConfig} from './delete-dialog/delete-dialog-config.model';
import {Pages, Page} from "../core/services/navigation/pages.service";

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

  private league = new League();

  private projectForm:ControlGroup;
  private showingForm:boolean;
  private editingForm:boolean;
  private editingLeague:League;

  private leagues$:Observable<Array<LeagueHolder>>;

  constructor(public dialog:MdDialog, public element:ElementRef,
              private appRef:ApplicationRef,
              private leaguesStore:LeaguesStore,
              loadingState:LoadingState, pages:Pages, fb:FormBuilder) {
    console.log('leagues @ init');

    this.loadingStateSubscription = loadingState.subscribe((loading:boolean) => {
      this.loading = loading;
    });

    pages.emit(Page.LEAGUES);

    this.projectForm = fb.group({
      name: ['', Validators.required,
        (control:Control) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              let leagueName = control.value;
              console.log('leagues @ validating league name:', leagueName);

              if (this.editingForm && this.editingLeague.name === leagueName) {
                resolve(null);
                return;
              }

              leaguesStore.validateExists(leagueName, resolve);
            }, TIMEOUT_VALIDATION_LEAGUE_NAME);
          });
        }
      ],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(30)])]
    });
  }

  cancel() {
    this.resetForm();
  }

  persist() {
    console.log('leagues @ save', this.league);

    let doResetForm = () => this.resetForm();

    if (this.editingForm) {
      this.leaguesStore.update(this.league, this.editingLeague, doResetForm);
    } else {
      this.leaguesStore.save(this.league, doResetForm);
    }
  }

  edit(league:League) {
    console.log('leagues @ edit', league);
    this.showingForm = false;
    this.appRef.tick();

    this.league = _.clone(league);
    this.editingLeague = league;
    this.editingForm = true;
    this.showingForm = true;
  }

  private resetForm() {
    this.league = new League();
    this.editingForm = false;
    this.showingForm = false;
  }

  leave(league:League) {
    console.log('leagues @ leave', league);

    this.leaguesStore.leave(league);
  }

  deleteConfirm(league:League, ev) {
    console.log('leagues @ delete', league);

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


