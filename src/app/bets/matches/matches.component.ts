import {Component} from 'angular2/core';

import {BetsCardListCmp} from '../card-list/card-list.component';
import {MatchesService} from '../services/matches.service';
import {MatchGroup, Matches} from '../models/bets.models';

@Component({
  directives: [BetsCardListCmp],
  template: require('./matches.html'),
  styles: [require('./matches.scss')]
})
export class MatchesBetsCmp {

  private current:Array<MatchGroup>;
  private history:Array<MatchGroup>;

  private hidingCurrentMatches:boolean;
  private showingHistory:boolean;

  constructor(private matches:MatchesService) {
    console.log('match bets @ init');
  }

  ngOnInit() {
    this.matches.getMatchesByDay()
      .subscribe((matches:Matches) => {
        this.current = matches.current;
        this.history = matches.history;

        this.hidingCurrentMatches = this.current.length === 0;
        this.showingHistory = this.hidingCurrentMatches;
      });
  }

}
