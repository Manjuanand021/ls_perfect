import { Type, InjectionToken } from '@angular/core';

import {
    DynamicFormInput,
    LfFormInputTextComponent,
    LfFormStaticTextComponent,
    LfFormInputTextareaComponent,
    LfFormInputMaskComponent,
    LfFormInputNumberComponent,
    LfFormInputEmailComponent,
    LfFormInputDateComponent,
    LfFormInputTaxIdComponent,
    LfFormRadioButtonGroupComponent,
    LfFormCheckboxComponent,
    LfFormButtonComponent,
    LfFormInputDateRangeComponent,
    LfFormHyperlinkComponent,
    LfFormSelectComponent
} from '../dynamic-form-input';

export type DynamicFieldsRegistryType = { readonly [type: string]: Type<DynamicFormInput> };

export const DYNAMIC_FIELDS_REGISTRY = new InjectionToken<DynamicFieldsRegistryType>('dynamic.fields.registry');

export const LfDynamicFieldsRegistry: DynamicFieldsRegistryType = {
    button: LfFormButtonComponent,
    inputtext: LfFormInputTextComponent,
    statictext: LfFormStaticTextComponent,
    inputtextarea: LfFormInputTextareaComponent,
    inputmask: LfFormInputMaskComponent,
    inputnumber: LfFormInputNumberComponent,
    inputemail: LfFormInputEmailComponent,
    inputdate: LfFormInputDateComponent,
    inputtaxid: LfFormInputTaxIdComponent,
    dropdown: LfFormSelectComponent,
    radiobuttongroup: LfFormRadioButtonGroupComponent,
    checkbox: LfFormCheckboxComponent,
    listvaluelabel: LfFormInputDateRangeComponent,
    daterange: LfFormInputDateRangeComponent,
    hyperlink: LfFormHyperlinkComponent
};
