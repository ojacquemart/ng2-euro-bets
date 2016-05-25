import {Component, Input} from 'angular2/core';
import {MdDialogRef} from "ng2-material/components/dialog/dialog_ref";
import {League} from "../models/league.models";
import {PictureReader} from "../services/picture.reader.helper";
import {LeaguesStore} from "../services/leagues-store.service";
import {ControlGroup} from "angular2/common";
import {FormBuilder} from "angular2/common";
import {Validators} from "angular2/common";
import {Control} from "angular2/common";

const TIMEOUT_VALIDATION_LEAGUE_NAME = 750;

@Component({
  styles: [require('./form-dialog.scss')],
  template: require('./form-dialog.html')
})
export class LeagueFormDialogCmp {

  @Input() league:League;
  @Input() editingLeague:League;
  @Input() editMode:boolean;

  private projectForm:ControlGroup;

  private imageSrc;
  private imageError;

  constructor(private dialog:MdDialogRef, private leaguesStore:LeaguesStore, fb:FormBuilder) {
    this.projectForm = fb.group({
      name: ['', Validators.required,
        (control:Control) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              let leagueName = control.value;
              console.log('leagues @ validating league name:', leagueName);

              if (this.editMode && this.editingLeague.name === leagueName) {
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

  persist() {
    console.log('leagues @ save', this.league);

    this.league.image = this.imageSrc || '';

    if (this.editMode) {
      this.leaguesStore.update(this.league, this.editingLeague)
        .then(() => this.dialog.close(true));
    } else {
      this.leaguesStore.save(this.league)
        .then(() => this.dialog.close());
    }
  }

  ngOnInit() {
    this.imageSrc = this.league.image;
  }

}
