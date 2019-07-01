import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
    ViewValidationDialog,
    VALIDATION_MESSAGE_BUILDER_REGISTRY,
    LfValidationMessageBuilderRegistry,
    ValidationValueFormatterRegistry,
    LfValidationValueFormatterRegistry
} from 'life-core/view-model/validation';

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [ViewValidationDialog],
    providers: [
        { provide: VALIDATION_MESSAGE_BUILDER_REGISTRY, useValue: LfValidationMessageBuilderRegistry },
        { provide: ValidationValueFormatterRegistry, useClass: LfValidationValueFormatterRegistry }
    ],
    entryComponents: [ViewValidationDialog]
})
export class ViewModelModule {}
