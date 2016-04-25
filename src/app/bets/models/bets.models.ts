export interface Stadium {
  id: number;
  name: string;
  city: string;
}

export interface Team {
  name: string;
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
  code: string;
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

export interface MatchGroup {
  day: string;
  items: Array<Match>;
}
