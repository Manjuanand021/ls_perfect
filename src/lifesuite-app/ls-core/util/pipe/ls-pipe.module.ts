import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    GetYesNoStringPipe,
    GetCreditCardTypePipe,
    GetCreditCardExpirationFromPolicyPipe,
    DBDatePipe,
    LsPhoneNumberPipe,
    MaskPipe,
    TaxIdMaskPipe,
    StateListPickerPipe,
    GetZipCodeTypePipe
} from './index';
import { UserNamePipe } from './username.pipe';

export const LS_PIPE_EXPORTS: Array<any> = [
    GetYesNoStringPipe,
    GetCreditCardTypePipe,
    GetCreditCardExpirationFromPolicyPipe,
    DBDatePipe,
    UserNamePipe,
    LsPhoneNumberPipe,
    MaskPipe,
    TaxIdMaskPipe,
    StateListPickerPipe,
    GetZipCodeTypePipe
];

@NgModule({
    imports: [CommonModule],
    declarations: [
        GetYesNoStringPipe,
        GetCreditCardTypePipe,
        GetCreditCardExpirationFromPolicyPipe,
        DBDatePipe,
        UserNamePipe,
        LsPhoneNumberPipe,
        MaskPipe,
        TaxIdMaskPipe,
        StateListPickerPipe,
        GetZipCodeTypePipe
    ],
    providers: [TaxIdMaskPipe],
    exports: [...LS_PIPE_EXPORTS]
})
export class LsPipeModule {}
