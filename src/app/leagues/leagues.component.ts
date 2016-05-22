import {ApplicationRef, Component, ElementRef} from 'angular2/core';
import {FORM_DIRECTIVES, Control, ControlGroup, FormBuilder, Validators} from 'angular2/common';

import {Observable} from 'rxjs/Observable';

import {LoadingState} from '../core/services/loading-state/loading-state.service';
import {Pages, Page} from '../core/services/navigation/pages.service';

import {League} from './models/league.models';
import {LeaguesStore} from './services/leagues-store.service';
import {PictureReader} from './services/picture.reader.helper';

import {LeagueHolder} from './models/league.models';
import {LeagueCardItemCmp} from "./league-card-item/league-card-item.component";

const TIMEOUT_VALIDATION_LEAGUE_NAME = 750;

@Component({
  template: require('./leagues.html'),
  styles: [require('./leagues.scss')],
  directives: [FORM_DIRECTIVES, LeagueCardItemCmp]
})
export class LeaguesCmp {

  private loading = false;
  private loadingStateSubscription;

  private league = new League();

  private projectForm:ControlGroup;
  private showingForm:boolean;
  private editingForm:boolean;
  private editingLeague:League;
  private imageSrc;
  private imageError;

  private leagues$:Observable<Array<LeagueHolder>>;

  constructor(private appRef:ApplicationRef,
              private leaguesStore:LeaguesStore,
              private element:ElementRef,
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

  previewBanner(input) {
    console.log('leagues @ preview banner');

    let pictureReader = new PictureReader(input);
    pictureReader.read()
      .subscribe(imageSrc => {
        this.imageSrc = imageSrc;
        this.imageError = null;
        this.league.imageModerated = false;
      }, error => {
        this.imageSrc = null;
        this.imageError = error;
      });
  }

  removeBanner() {
    console.log('leagues @ remove banner');

    this.imageSrc = null;
  }

  cancel() {
    this.resetForm();
  }

  persist() {
    console.log('leagues @ save', this.league);

    let doResetForm = () => this.resetForm();
    this.league.image = this.imageSrc || '';

    if (this.editingForm) {
      this.leaguesStore.update(this.league, this.editingLeague)
        .then(() => this.resetForm());
    } else {
      this.leaguesStore.save(this.league)
        .then(() => this.resetForm())
    }
  }

  edit(league:League) {
    console.log('leagues @ edit', league);
    this.showingForm = false;
    this.appRef.tick();

    this.league = _.clone(league);
    if (!_.isEmpty(this.league.image)) {
      this.imageSrc = this.league.image;
    }
    this.editingLeague = league;
    this.editingForm = true;
    this.showingForm = true;
    window.scrollTo(0, 0);
  }

  private resetForm() {
    this.league = new League();
    this.editingForm = false;
    this.showingForm = false;
    this.imageSrc = null;
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


