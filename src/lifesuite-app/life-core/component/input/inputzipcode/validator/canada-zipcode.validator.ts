import { Injectable } from '@angular/core';

import { ValidatorFactory, Validator, ValidatorTypes } from '../../shared/validators';
import { IZipCodeValidator } from './zipcode-validator.type';

@Injectable({
    providedIn: 'root'
})
export class CanadaZipCodeValidator implements IZipCodeValidator {
    public createValidator(): Validator {
        return ValidatorFactory.createRegExpControlValidator(
            ValidatorTypes.ZipCode,
            this.getZipCodeRegExp(),
            'invalidCanadaPostalCode'
        );
    }

    public formatValue(value: string): string {
        return value;
    }

    public getMaxFormattedValueLength(): number {
        return 7;
    }

    public getRestrictRegExp(): RegExp {
        return /[0-9a-zA-Z ]/;
    }

    private getZipCodeRegExp(): Array<RegExp> {
        return [/^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z][ ]?[0-9][ABCEGHJ-NPRSTV-Z][0-9]$/];
    }
}
