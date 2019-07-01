import {
    DynamicFieldsRegistryType,
    LfFormInputTextComponent,
    LfFormInputTextareaComponent,
    LfFormInputMaskComponent,
    LfFormInputNumberComponent,
    LfFormInputEmailComponent,
    LfFormInputTaxIdComponent,
    LfFormRadioButtonGroupComponent,
    LfFormCheckboxComponent,
    LfFormButtonComponent,
    LfFormListValueLabelComponent,
    LfFormInputDateRangeComponent,
    LfFormHyperlinkComponent,
    LfFormSelectComponent
} from 'life-core/component/dynamic-form';
import { LsFormInputDateComponent, LsFormStaticTextComponent } from '../dynamic-form-input';

export const LsDynamicFieldsRegistry: DynamicFieldsRegistryType = {
    button: LfFormButtonComponent,
    inputtext: LfFormInputTextComponent,
    statictext: LsFormStaticTextComponent,
    inputtextarea: LfFormInputTextareaComponent,
    inputmask: LfFormInputMaskComponent,
    inputnumber: LfFormInputNumberComponent,
    inputemail: LfFormInputEmailComponent,
    inputdate: LsFormInputDateComponent,
    inputtaxid: LfFormInputTaxIdComponent,
    dropdown: LfFormSelectComponent,
    radiobuttongroup: LfFormRadioButtonGroupComponent,
    checkbox: LfFormCheckboxComponent,
    listvaluelabel: LfFormListValueLabelComponent,
    daterange: LfFormInputDateRangeComponent,
    hyperlink: LfFormHyperlinkComponent
};
