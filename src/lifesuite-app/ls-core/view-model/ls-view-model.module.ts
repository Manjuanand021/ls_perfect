import { NgModule } from '@angular/core';

import { ViewModelModule } from 'life-core/view-model/view-model.module';
import { ValidationMessageRegistry } from 'life-core/view-model/validation';
import { LsValidationMessageRegistry } from 'ls-core/view-model/validation';

@NgModule({
    imports: [ViewModelModule],
    providers: [{ provide: ValidationMessageRegistry, useClass: LsValidationMessageRegistry }]
})
export class LsViewModelModule {}
