import { FormControl } from '@angular/forms';

export type Validator = (control: FormControl, value?: any) => ValidationResult;

export const ValidatorTypes = {
    General: 'General',
    Text: 'Text',
    NumberRange: 'NumberRange',
    DateRange: 'DateRange',
    HeightRange: 'HeightRange',
    ZipCode: 'ZipCode',
    TaxId: 'TaxId'
};

export interface ValidationError {
    type: string;
    control?: FormControl;
    value?: any;
}

export interface RangeValidationError extends ValidationError {
    minValue?: any;
    maxValue?: any;
}

export type ValidationResult = { [key: string]: ValidationError };

export class ValidatorFactory {
    public static createRangeMinValidator(validatorType: string, minValue: any): Validator {
        return function(control: FormControl, value?: any): ValidationResult {
            const controlValue: any = value ? value : control.value;
            const error: RangeValidationError = {
                type: validatorType,
                control: control,
                minValue: minValue,
                value: controlValue
            };
            const result: ValidationResult = {
                minError: error
            };
            return controlValue != null && minValue != null && controlValue < minValue ? result : null;
        };
    }

    public static createRangeMaxValidator(validatorType: string, maxValue: any): Validator {
        return function(control: FormControl, value?: any): ValidationResult {
            const controlValue: any = value ? value : control.value;
            const error: RangeValidationError = {
                type: validatorType,
                control: control,
                maxValue: maxValue,
                value: controlValue
            };
            const result: ValidationResult = {
                maxError: error
            };
            return controlValue != null && maxValue != null && controlValue > maxValue ? result : null;
        };
    }

    public static createRegExpControlValidator(
        validatorType: string,
        validationTests: Array<RegExp>,
        errorType: string = 'invalidValue'
    ): Validator {
        return function(control: FormControl, value?: any): ValidationResult {
            const controlValue: any = value ? value : control.value;
            const error: ValidationError = {
                type: validatorType,
                control: control,
                value: controlValue
            };
            const result: ValidationResult = {};
            result[errorType] = error;
            return controlValue && !validationTests.every(regExp => regExp.test(controlValue)) ? result : null;
        };
    }

    public static createValidationFunctionValidator(
        validatorType: string,
        validationTest: (x: any) => boolean
    ): Validator {
        return function(control: FormControl, value?: any): ValidationResult {
            const controlValue: any = value ? value : control.value;
            const error: ValidationError = {
                type: validatorType,
                control: control,
                value: controlValue
            };
            const result: ValidationResult = {
                invalidValue: error
            };
            return controlValue && !validationTest(controlValue) ? result : null;
        };
    }

    public static createDateValidator(
        validatorType: string,
        validationTest: (x: string) => boolean,
        errorType: string = 'invalidDate'
    ): Validator {
        return function(control: FormControl, value?: any): ValidationResult {
            const controlValue: any = value ? value : control.value;
            const error: ValidationError = {
                type: validatorType,
                control: control,
                value: controlValue
            };
            const result: ValidationResult = {};
            result[errorType] = error;
            return controlValue && !validationTest(controlValue) ? result : null;
        };
    }

    public static createHeightFootValidator(validatorType: string, validationTest: (x: any) => boolean): Validator {
        return function(control: FormControl, value?: any): ValidationResult {
            const controlValue: any = value ? value : control.value;
            const error: ValidationError = {
                type: validatorType,
                control: control,
                value: controlValue
            };
            const result: ValidationResult = {
                invalidFoot: error
            };
            return controlValue && !validationTest(controlValue) ? result : null;
        };
    }

    public static createHeightInchValidator(validatorType: string, validationTest: (x: any) => boolean): Validator {
        return function(control: FormControl, value?: any): ValidationResult {
            const controlValue: any = value ? value : control.value;
            const error: ValidationError = {
                type: validatorType,
                control: control,
                value: controlValue
            };
            const result: ValidationResult = {
                invalidInch: error
            };
            return controlValue && !validationTest(controlValue) ? result : null;
        };
    }
}
