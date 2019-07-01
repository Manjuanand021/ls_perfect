import { Pipe, PipeTransform } from '@angular/core';

import { CreditCardUtil } from 'ls-core/component/input/shared/creditcard.util';
/*
 * Translate the credit card type Id into credit card type text defined in lf-inputcreditcard.
 * Usage:
 *   value | getCreditCardType
 */
@Pipe({ name: 'getCreditCardType' })
export class GetCreditCardTypePipe implements PipeTransform {
    public transform(value: string): string {
        return value ? CreditCardUtil.getCreditCardType(value) : null;
    }
}
