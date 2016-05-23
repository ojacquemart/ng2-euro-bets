import {Component, Input} from 'angular2/core';
import {Control, ControlGroup, FormBuilder, Validators} from 'angular2/common';

import {ErrorBubble} from '../../core/components/error-bubble/error-bubble.component';
import {FlagIcon} from '../../core/components/flag-icon/flag-icon.component';
import {RANDOM_NUMBER_GENERATOR} from '../../core/services/util/random-number-generator.helper';

import {BetsService} from '../services/bets.service';
import {Bet, Match} from '../models/bets.models';
import {validateScore} from './score.validator';

@Component({
  selector: 'bet-card',
  directives: [FlagIcon, ErrorBubble],
  template: require('./card-list-item.html'),
  styles: [require('./card-list-item.scss')]
})
export class BetCardListItemCmp {
  @Input()
  private match:Match;
  @Input()
  private lang:string;

  private feelingLucky;
  private showingError;

  private form;

  constructor(private bets:BetsService, private formBuilder:FormBuilder) {
    this.form = this.formBuilder.group({
        home: [0, Validators.required],
        away: [0, Validators.required]
      },
      {validator: validateScore('home', 'away')}
    );
  }

  ngOnInit() {
    if (this.match.status === 0) {
      this.initForm();
    }
  }

  private initForm() {
    this.updateFormValue(this.match.bet);

    this.form
      .valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .filter(() => this.form.valid)
      .subscribe(data => {
        this.match.bet = {
          homeGoals: data.home,
          awayGoals: data.away,
          feelingLucky: !!this.feelingLucky,
          timestamp: Firebase.ServerValue.TIMESTAMP
        };

        console.log('bet @ change', data, this.match.bet);

        this.showingError = false;

        let onSuccess = () => {
          this.feelingLucky = false;
        };
        let onError = () => {
          this.showingError = true;
        };

        this.bets.save(this.match, onSuccess, onError)
          .then(_ => onSuccess())
          .catch(_ => onError());
      });
  }

  onFeelingLucky() {
    this.feelingLucky = true;
    this.updateFormValue({
      homeGoals: RANDOM_NUMBER_GENERATOR.generate(),
      awayGoals: RANDOM_NUMBER_GENERATOR.generate()
    });
  }

  private updateFormValue(bet:Bet) {
    this.form.controls['home'].updateValue(bet.homeGoals);
    this.form.controls['away'].updateValue(bet.awayGoals);
  }

}
