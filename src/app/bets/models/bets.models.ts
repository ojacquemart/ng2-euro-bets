export interface Stadium {
  code: string;
  name: string;
  city: string;
}

export interface Team {
  name: string;
  flag: string;
  goals: number;
  winner: boolean;
}

export interface Bet {
  homeGoals: number;
  awayGoals: number;
  timestamp?: number;
}

export interface Match {
  phase: string;
  day: string;
  hour: string;
  stadium: Stadium;
  finished: boolean,
  bet?: Bet,
  home: Team;
  away: Team;

  videoUrl?: string;
}

export interface MatchGroup {
  day: string;
  items: Array<Match>;
}
