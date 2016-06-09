export interface UserTableIndexed {
  index: number;
  position: number|string;
  points: number|string;
}

export const EMPTY_USER_TABLE = {index: 0, position: '-', points: '-'};
