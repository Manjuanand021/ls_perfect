import { Type } from '@angular/core';

import { Validator } from '../../shared/validators';

export interface IZipCodeValidator {
    createValidator(): Validator;

    formatValue(value: string): string;

    getMaxFormattedValueLength(): number;

    getRestrictRegExp(): RegExp;
}

export type ZipCodeValidatorRegistryType = { readonly [zipCodeType: string]: Type<IZipCodeValidator> };
