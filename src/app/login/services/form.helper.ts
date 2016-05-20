import {Control} from 'angular2/common';
import {Validators} from 'angular2/common';

const mailValidator = ((control:Control):ValidationResult => {
  if (_.isEmpty(control.value)) {
    return null;
  }

  var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  if (!EMAIL_REGEXP.test(control.value)) {
    return {invalidemail: true};
  }

  return null;
});

interface ValidationResult {
  [key: string]: boolean;
}

const MIN_PASSWORD_LENGTH = 8;

export const EMAIL_VALIDATORS = Validators.compose([Validators.required, mailValidator]);
export const PASSWORD_VALIDATORS = Validators.compose([Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)])
