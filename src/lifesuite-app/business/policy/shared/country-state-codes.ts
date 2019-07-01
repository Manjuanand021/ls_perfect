import { CountryCodes } from 'ls-core/model';

export const CountryStateCodes: string[] = Object.keys(CountryCodes).map(key => CountryCodes[key]);
