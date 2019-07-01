import { FormControl } from '@angular/forms';
import { Validator, ValidationResult } from './validators';

export class ValidatorUtil {
    public static executeValidators(validators: Validator[], control: FormControl, value?: any): ValidationResult {
        let validationResult: ValidationResult;
        if (validators) {
            validators.some(validator => {
                validationResult = validator(control, value);
                return validationResult != null;
            });
        }
        return validationResult;
    }
}
