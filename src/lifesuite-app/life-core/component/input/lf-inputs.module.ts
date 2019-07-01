import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule, Dropdown } from 'primeng/dropdown';
import { InputMaskModule, InputMask } from 'primeng/inputmask';
import { CheckboxModule, Checkbox } from 'primeng/checkbox';

import { LfInputDateModule, LF_INPUTDATE_EXPORTS } from './inputdate/lf-inputdate.module';
import { LfSelectModule, LF_SELECT_EXPORTS } from './dropdown/lf-select.module';
import { LfInputText } from './inputtext/lf-inputtext';
import { LfStaticText } from './statictext/lf-statictext';
import { LfInputNumberModule, LF_INPUTNUMBER_EXPORTS } from './inputnumber/lf-inputnumber.module';
import { LfInputMask } from './inputmask/lf-inputmask';
import { LfCheckbox } from './checkbox/lf-checkbox';
import { LfInputTextarea } from './inputtextarea/lf-inputtextarea';
import { LfRadioButtonGroup } from './radiobutton/lf-radiobuttongroup';
import { LfRadioButton } from './radiobutton/lf-radiobutton';
import { LfListValueLabel } from './listvaluelabel/lf-listvaluelabel';
import { LfInputTime } from './inputtime/lf-inputtime';
import { LfInputPhone } from './inputphone/lf-inputphone';
import { LfInputTaxId } from './inputtaxid/lf-inputtaxid';
import { LfInputBankAccount } from './inputbankaccount/lf-inputbankaccount';
import { LfInputBankRouting } from './inputbankrouting/lf-inputbankrouting';
import { LfInputCreditCardExpiration } from './inputcreditcardexpiration/lf-inputcreditcardexpiration';
import { LfInputCreditCard } from './inputcreditcard/lf-inputcreditcard';
import { LfInputHeight } from './inputheight/lf-inputheight';
import { LfInputWeight } from './inputweight/lf-inputweight';
import { LfInputDateRange } from './inputdaterange/lf-inputdaterange';
import { LfHyperlink } from './hyperlink/lf-hyperlink';
import { LfInputZipCodeModule, LF_INPUTZIPCODE_EXPORTS } from './inputzipcode/lf-inputzipcode.module';
import { LfInputEmail } from './inputemail/lf-inputemail';

export const LF_INPUT_EXPORTS: Array<any> = [
    // PrimeNG input components
    Dropdown,
    InputMask,
    LfStaticText,
    Checkbox,
    // Custom input components
    LfInputText,
    ...LF_INPUTNUMBER_EXPORTS,
    LfInputMask,
    ...LF_INPUTDATE_EXPORTS,
    ...LF_SELECT_EXPORTS,
    LfInputTime,
    LfInputEmail,
    LfCheckbox,
    LfInputTextarea,
    LfRadioButtonGroup,
    LfRadioButton,
    LfListValueLabel,
    LfInputPhone,
    LfInputTaxId,
    LfInputBankAccount,
    LfInputBankRouting,
    LfInputCreditCardExpiration,
    LfInputCreditCard,
    LfInputHeight,
    LfInputWeight,
    LfInputDateRange,
    LfHyperlink,
    ...LF_INPUTZIPCODE_EXPORTS
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // PrimeNG input modules
        InputTextModule,
        InputMaskModule,
        DropdownModule,
        CheckboxModule,
        LfSelectModule,
        LfInputDateModule,
        LfInputNumberModule,
        LfInputZipCodeModule
    ],
    declarations: [
        LfInputText,
        LfStaticText,
        LfInputMask,
        LfInputTime,
        LfInputEmail,
        LfCheckbox,
        LfInputTextarea,
        LfRadioButtonGroup,
        LfRadioButton,
        LfListValueLabel,
        LfInputPhone,
        LfInputTaxId,
        LfInputBankAccount,
        LfInputBankRouting,
        LfInputCreditCardExpiration,
        LfInputCreditCard,
        LfInputHeight,
        LfInputWeight,
        LfInputDateRange,
        LfHyperlink
    ],
    exports: [...LF_INPUT_EXPORTS]
})
export class LfInputsModule {}
