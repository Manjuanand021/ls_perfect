import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LfFormsModule } from 'life-core/component/form/lf-forms.module';
import { LfInputsModule, LF_INPUT_EXPORTS } from 'life-core/component/input/lf-inputs.module';
import { LfButtonModule, LF_BUTTON_EXPORTS } from 'life-core/component/button/lf-button.module';
import { PipeModule } from 'life-core/util/pipe/pipe.module';

import { DynamicFieldDirective } from './dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './dynamic-form.component';

import {
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
    LfFormListValueLabelComponent,
    LfFormInputDateRangeComponent,
    LfFormStaticTextConfigPipe,
    LfFormHyperlinkComponent,
    LfFormSelectComponent
} from './dynamic-form-input';

export const LF_DYNAMIC_FORM_EXPORTS: Array<any> = [DynamicFormComponent, LfFormStaticTextConfigPipe];

@NgModule({
    imports: [CommonModule, FormsModule, LfFormsModule, LfInputsModule, LfButtonModule, PipeModule],
    declarations: [
        DynamicFieldDirective,
        DynamicFormComponent,
        LfFormButtonComponent,
        LfFormInputTextComponent,
        LfFormInputTextareaComponent,
        LfFormInputMaskComponent,
        LfFormInputNumberComponent,
        LfFormInputEmailComponent,
        LfFormInputDateComponent,
        LfFormInputTaxIdComponent,
        LfFormRadioButtonGroupComponent,
        LfFormCheckboxComponent,
        LfFormListValueLabelComponent,
        LfFormInputDateRangeComponent,
        LfFormStaticTextComponent,
        LfFormStaticTextConfigPipe,
        LfFormHyperlinkComponent,
        LfFormSelectComponent
    ],
    exports: [...LF_DYNAMIC_FORM_EXPORTS, ...LF_INPUT_EXPORTS, ...LF_BUTTON_EXPORTS],
    entryComponents: [
        LfFormButtonComponent,
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
        LfFormListValueLabelComponent,
        LfFormInputDateRangeComponent,
        LfFormHyperlinkComponent,
        LfFormSelectComponent
    ]
})
export class LfDynamicFormModule {}
