import {Component, Input} from 'angular2/core';
import {Control, ControlGroup, FormBuilder, Validators} from 'angular2/common';

import {Bet, Match} from '../models/bets.models';

import {RANDOM_NUMBER_GENERATOR} from '../../core/services/util/randomNumberGenerator';

import {validateScore} from './score.validator';

@Component({
  selector: 'bet-card',
  styles: [require('./bet-card.scss')],
  template: require('./bet-card.html')
})
export class BetCardCmp {
  @Input()
  private match:Match;

  private form;

  constructor(private formBuilder:FormBuilder) {
    this.form = this.formBuilder.group({
        home: [0, Validators.required],
        away: [0, Validators.required]
      },
      {validator: validateScore('home', 'away')}
    );
  }

  ngOnInit() {
    if (!this.match.finished) {
      this.initForm();
    }
  }

  private initForm() {
    console.log('bet @ init form', this.match);

    this.updateFormValue(this.match.bet);

    this.form
      .valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(data => {
        if (this.form.valid) {
          this.match.bet = {
            homeGoals: data.home,
            awayGoals: data.away
          };

          console.log('bet @ change', data, this.match.bet);

          // TODO: save user bet to firebase
        }
      });
  }

  onFeelingLucky() {
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
