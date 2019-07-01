import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { CasePaymentComponent } from './case-payment.component';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [CasePaymentComponent],
    exports: [CasePaymentComponent]
})
export class CasePaymentModule {}
