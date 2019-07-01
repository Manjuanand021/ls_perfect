import { Pipe, PipeTransform } from '@angular/core';
/*
 * Translate the PhoneDTO into dispay text
 * Usage:
 *   value | lsPhone
*/
@Pipe({ name: 'lsPhone' })
export class LsPhoneNumberPipe implements PipeTransform {
    public transform(value: any): string {
        if (value) {
            let phoneNumber = value.AreaCode ? `(${value.AreaCode})` : '';
            phoneNumber += value.Prefix ? `${value.Prefix}-` : '';
            phoneNumber += value.Suffix ? value.Suffix : '';
            phoneNumber += value.Extension ? ` Ext ${value.Extension}` : '';
            return phoneNumber;
        } else {
            return '';
        }
    }
}
