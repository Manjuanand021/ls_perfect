import { Injectable } from '@angular/core';

import { Validator } from '../../shared/validators';
import { IZipCodeValidator } from './zipcode-validator.type';

@Injectable({
    providedIn: 'root'
})
export class DefaultZipCodeValidator implements IZipCodeValidator {
    public createValidator(): Validator {
        return null;
    }

    public formatValue(value: string): string {
        return value;
    }

    public getMaxFormattedValueLength(): number {
        return DefaultMaxFormattedValueLength;
    }

    public getRestrictRegExp(): RegExp {
        return DefaultRestrictRegExp;
    }
}

export const DefaultMaxFormattedValueLength: number = 7;
export const DefaultRestrictRegExp: RegExp = /./;
