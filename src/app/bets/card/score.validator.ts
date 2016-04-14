import {Control, ControlGroup} from 'angular2/common';

const MIN_SCORE = 0;
const MAX_SCORE = 10;

export const validateScore = ((homeKey:string, awayKey:string) => {
  return (group:ControlGroup):{[key: string]: any} => {
    let home = group.controls[homeKey];
    let away = group.controls[awayKey];

    if (isValid(home.value) && isValid(away.value)) {
      return null;
    }

    return {
      invalidScore: true
    };
  };
});

const isValid = (value:any) => {
  return !(isNaN(value) || value < MIN_SCORE || value > MAX_SCORE);
};
