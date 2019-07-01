import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IntlModule } from 'life-core/i18n/intl.module';

import { loadCldrData } from './cldr-data-loader';

import { ComponentsModule } from 'life-core/component/components.module';
import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { LplaComponentsModule } from 'lpla-core/component/lpla-components.module';
import { SampleCompositeInput } from './shared/sample-composite-input';
import { TestRadioButtonGroup } from './test-radiobutton-group';
import { TestInputNumber } from './test-inputnumber';
import { TestInputText } from './test-inputtext';
import { TestDropDown } from './test-dropdown';
import { TestInputDate } from './test-inputdate';
import { TestInputMask } from './test-inputmask';
import { TestCheckbox } from './test-checkbox';
import { TestInputTextarea } from './test-inputtextarea';
import { TestInputPhone } from './test-inputphone';
import { TestSampleCompositeInput } from './test-sample-composite-input';
import { TestInputBankAccount } from './test-inputbankaccount';

loadCldrData();

@NgModule({
    imports: [CommonModule, FormsModule, IntlModule, ComponentsModule, LsComponentsModule, LplaComponentsModule],
    declarations: [
        TestRadioButtonGroup,
        TestInputNumber,
        TestInputText,
        TestDropDown,
        TestInputDate,
        TestInputMask,
        TestCheckbox,
        TestInputTextarea,
        TestInputPhone,
        TestSampleCompositeInput,
        TestInputBankAccount,
        SampleCompositeInput
    ],
    providers: []
})
export class TestInputsModule {}
