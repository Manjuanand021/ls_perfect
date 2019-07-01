import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { ZipCodeType } from 'life-core/component/input/';

/*
 * Get zip code type defined in lf-inputzipcode from country code
 * Usage:
 *   value | getZipCodeType
*/
@Pipe({ name: 'getZipCodeType' })
@Injectable()
export class GetZipCodeTypePipe implements PipeTransform {
    public transform(value: string): ZipCodeType {
        return CountryIdToZipCodeTypeMap[value] || ZipCodeType.Default;
    }
}

export const CountryIdToZipCodeTypeMap = {
    USA: ZipCodeType.US,
    CANADA: ZipCodeType.Canada
};
