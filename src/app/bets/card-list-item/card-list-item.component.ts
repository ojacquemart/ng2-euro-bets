import {Component, Input} from 'angular2/core';
import {Control, ControlGroup, FormBuilder, Validators} from 'angular2/common';

import {Bet, Match} from '../models/bets.models';

import {RANDOM_NUMBER_GENERATOR} from '../../core/services/util/randomNumberGenerator';

import {validateScore} from './score.validator';
import {UserBetsStore} from '../services/user-bets.store.service';
import {FlagIcon} from "../../core/components/flag-icon/flag-icon.component";

@Component({
  selector: 'bet-card',
  directives: [FlagIcon],
  template: require('./card-list-item.html'),
  styles: [require('./card-list-item.scss')]
})
export class BetCardListItemCmp {
  @Input()
  private match:Match;
  @Input()
  private lang:string;

  private form;

  constructor(private userBetsStore:UserBetsStore, private formBuilder:FormBuilder) {
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
          awayGoals: data.away
        };

        console.log('bet @ change', data, this.match.bet);
        this.userBetsStore.save(this.match);
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
