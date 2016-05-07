export interface Stadium {
  id: number;
  name: string;
  city: string;
}

export interface Team {
  i18n: I18n;
  isoAlpha2Code: string;
  goals: number;
  winner: boolean;
}

export interface Bet {
  homeGoals: number;
  awayGoals: number;
  timestamp?: number;
}

export interface Phase {
  state: string;
  code: string;
  i18n: I18n;
}

export interface Match {
  number: number;
  day: string;
  hour: string;
  timestamp: number;
  stadium: Stadium;
  phase: Phase;
  status: number;
  bet?: Bet;
  home: Team;
  away: Team;

  videoUrl?: string;
}

export interface GroupTable {
  group: Group;
  showMatches: boolean;
  matches: Array<MatchGroup>;
}

export interface Group {
  code: string;
  i18n: I18n;
  members: Array<GroupMember>;
}

export interface GroupMember {
  i18n: I18n;
  isoAlpha2Code: String;
  position: string;
  points: string;
  win: string;
  lose: string;
  draw: string;
  goalsFor: string;
  goalsAgainst: string;
}

export interface MatchGroup {
  day: string;
  items: Array<Match>;
}

export interface I18n {
  fr: string;
  en: string;
}
