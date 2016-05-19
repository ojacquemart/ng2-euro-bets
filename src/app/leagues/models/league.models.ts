import {RANDOM_NUMBER_GENERATOR} from "../../core/services/util/random-number-generator.helper";
const BACKGROUND_COLORS = [
  '#BBDEF9', '#C5CAE9', '#FF4081', '#D1C4E9', '#B2DFDB', '#E1BEE7', '#FFEB3B', '#8BC34A', '#795548', '#FFCCBC'
];

export class League {
  slug:string;
  name:string;
  description:string;
  owner:string;
  ownerDisplayName:string;
  ownerProfileImageURL:string;
  image:string;
  imageModerated:boolean;
  background:string = BACKGROUND_COLORS[RANDOM_NUMBER_GENERATOR.generate(BACKGROUND_COLORS.length)];
  createdAt:number;
  updatedAt:number;
  members:Members;
}

export interface Members {
  [index: string]: boolean;
}

export interface LeagueHolder {
  league: League;
  membersCount: number;
  actions: LeagueActions;
}

export interface LeagueActions {
  canJoin: boolean;
  canLeave: boolean;
  canAlter: boolean;
}
