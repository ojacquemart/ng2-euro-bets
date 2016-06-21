import {Pagination} from './pagination.model';

export class UserPositionWithTable {
  userPosition:UserPosition;
  table:Table;
}

export interface UserPosition {
  userPosition:number|string;
  tableLastPosition:number;
}

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

export class LeagueTableRow {
  position:number;
  userIn:boolean;
  slug:string;
  name:string;
  assiduity:number;
  players:number;
  perfects:number;
  goods:number;
  bads:number;
}
