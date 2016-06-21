import {Component} from 'angular2/core';

import {LoadingState} from '../../core/services/loading-state/loading-state.service';

import {LeaguesTableService} from './leagues-table.service';

@Component({
  styles: [require('./leagues.scss')],
  template: require('./leagues.html')
})
export class LeaguesTableCmp {

  private leaguesTableRows;

  constructor(private loadingState:LoadingState, private globalLeaguesTable:LeaguesTableService) {
    console.log('leagues table @ init');
  }

  ngOnInit() {
    console.log('leagues table @ ngOnInit');
    this.loadingState.start();

    this.globalLeaguesTable.getLeaguesTable()
      .subscribe(leaguesTable => {
        this.leaguesTableRows = leaguesTable;
        this.loadingState.stop();
      });
  }

  ngOnDestroy() {
    this.loadingState.stop();
  }

}
