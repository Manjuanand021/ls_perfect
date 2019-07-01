import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormInput } from './form-input';
import { FormInputGroup } from './form-input-group';

export const LF_FORMS_EXPORTS: Array<any> = [FormInput, FormInputGroup];

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [FormInput, FormInputGroup],
    exports: [...LF_FORMS_EXPORTS]
})
export class LfFormsModule {}
