import { Pipe, PipeTransform } from '@angular/core';

import { CrediCardExpirationDateModel } from 'life-core/component/input/inputcreditcardexpiration';
import { CreditCardExpirationUtil } from 'ls-core/component/input/shared/creditcardexpiration.util';
import { PolicyDTO } from 'ls-core/model';
/*
 * Translate the credit card type Id into credit card type text defined in lf-inputcreditcard.
 * Usage:
 *   value | getCreditCardType
 */
@Pipe({ name: 'getCreditCardExpirationFromPolicy' })
export class GetCreditCardExpirationFromPolicyPipe implements PipeTransform {
    public transform(value: PolicyDTO): CrediCardExpirationDateModel {
        return CreditCardExpirationUtil.toCreditCardExpirationModel(value);
    }
}
