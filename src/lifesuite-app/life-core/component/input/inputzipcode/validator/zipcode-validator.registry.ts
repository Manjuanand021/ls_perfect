import { InjectionToken } from '@angular/core';

import { DefaultZipCodeValidator } from './default-zipcode.validator';
import { USZipCodeValidator } from './us-zipcode.validator';
import { CanadaZipCodeValidator } from './canada-zipcode.validator';
import { ZipCodeValidatorRegistryType } from './zipcode-validator.type';

export const ZIPCODE_VALIDATOR_REGISTRY = new InjectionToken<ZipCodeValidatorRegistryType>(
    'zipcode.validator.registry'
);

export const LfZipCodeValidatorRegistry: ZipCodeValidatorRegistryType = {
    US: USZipCodeValidator,
    Canada: CanadaZipCodeValidator,
    Default: DefaultZipCodeValidator
};
