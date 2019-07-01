import { Injectable } from '@angular/core';

import { ValidatorFactory, Validator, ValidatorTypes } from '../../shared/validators';
import { IZipCodeValidator } from './zipcode-validator.type';

@Injectable({
    providedIn: 'root'
})
export class USZipCodeValidator implements IZipCodeValidator {
    public createValidator(): Validator {
        return ValidatorFactory.createRegExpControlValidator(
            ValidatorTypes.ZipCode,
            this.getZipCodeRegExp(),
            'invalidUSZipCode'
        );
    }

    public formatValue(value: string): string {
        const deliveryAreaNumberLength = 5;
        const deliveryRouteNumberLength = 4;
        const separator = this.getPartSeparator();
        let formattedValue = '';
        if (value) {
            const unformattedValue = this.removeSeparator(value);
            if (unformattedValue.length == this.getMaxValueLength()) {
                const partAreaNumber = unformattedValue.substr(0, deliveryAreaNumberLength);
                const partRouteNumber = unformattedValue.substr(deliveryAreaNumberLength, deliveryRouteNumberLength);
                formattedValue = `${partAreaNumber}${separator}${partRouteNumber}`;
            } else {
                formattedValue = value;
            }
        }
        return formattedValue;
    }

    private removeSeparator(value: string): string {
        let newValue = value;
        const separator = this.getPartSeparator();
        if (separator && value.indexOf(separator) != -1) {
            newValue = value.replace(separator, '');
        }
        return newValue;
    }

    private getPartSeparator(): string {
        return '-';
    }

    private getMaxValueLength(): number {
        return 9;
    }

    public getMaxFormattedValueLength(): number {
        return 10;
    }

    public getRestrictRegExp(): RegExp {
        return /[0-9-]/;
    }

    private getZipCodeRegExp(): Array<RegExp> {
        return [/^[0-9]{5}([-]?[0-9]{4})?$/];
    }
}
