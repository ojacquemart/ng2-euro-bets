import {Pagination} from './page.model';

export class Table {
  constructor(public rows:Array<TableRow> = [], public pagination:Pagination = null) {
  }

  static empty() {
    return new Table();
  }

}

export interface TableRow {
  position: number;
  uid: string;
  displayName: string;
  profileImageURL: string;
  evolution: string;
  points: string;
  bets: string;
  perfects: string;
  goods: string;
  bads: string;
  percents: string;
  recents: Array<number>;
}

export interface Podium {
  steps: [{[key:number]:Array<PodiumMember> }];
}

export interface PodiumMember {
  uid: string;
  displayName: string;
  profileImageURL: string;
}
