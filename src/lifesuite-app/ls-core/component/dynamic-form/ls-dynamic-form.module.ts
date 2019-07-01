import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsInputsModule } from 'ls-core/component/input/ls-inputs.module';
import { LfFormsModule } from 'life-core/component/form/lf-forms.module';
import { LfInputsModule } from 'life-core/component/input/lf-inputs.module';
import { LfDynamicFormModule } from 'life-core/component/dynamic-form/lf-dynamic-form.module';
import { DYNAMIC_FIELDS_REGISTRY } from 'life-core/component/dynamic-form/dynamic-field/dynamic-fields.registry';

import { LsFormInputDateComponent, LsFormStaticTextComponent, LsFormStaticTextConfigPipe } from './dynamic-form-input';
import { LsDynamicFieldsRegistry } from './dynamic-field/dynamic-fields.registry';

@NgModule({
    imports: [CommonModule, FormsModule, LfFormsModule, LfInputsModule, LsInputsModule, LfDynamicFormModule],
    declarations: [LsFormInputDateComponent, LsFormStaticTextComponent, LsFormStaticTextConfigPipe],
    providers: [{ provide: DYNAMIC_FIELDS_REGISTRY, useValue: LsDynamicFieldsRegistry }],
    exports: [],
    entryComponents: [LsFormInputDateComponent, LsFormStaticTextComponent]
})
export class LsDynamicFormModule {}
