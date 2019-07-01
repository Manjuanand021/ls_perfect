import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Required to use 'pInputText' directive
import { InputTextModule } from 'primeng/inputtext';

import { LfInputZipCode } from './lf-inputzipcode';
import { ZIPCODE_VALIDATOR_REGISTRY, LfZipCodeValidatorRegistry } from './validator';

export const LF_INPUTZIPCODE_EXPORTS: Array<any> = [LfInputZipCode];

@NgModule({
    imports: [CommonModule, FormsModule, InputTextModule],
    declarations: [LfInputZipCode],
    exports: [...LF_INPUTZIPCODE_EXPORTS],
    providers: [{ provide: ZIPCODE_VALIDATOR_REGISTRY, useValue: LfZipCodeValidatorRegistry }]
})
export class LfInputZipCodeModule {}
