import { Injectable } from '@angular/core';

import { ValidationError, RangeValidationError } from 'life-core/component/input';
import { ValidationMessageService } from '../validation-message.service';
import { ValidationValueFormatterRegistry } from '../validation-value-formatter.registry';
import { ValidationMessageBuilder } from './validation-message.builder';

@Injectable({
    providedIn: 'root'
})
export class MaxErrorMessageBuilder extends ValidationMessageBuilder {
    constructor(
        validationMessageService: ValidationMessageService,
        validationValueFormatterRegistry: ValidationValueFormatterRegistry
    ) {
        super(validationMessageService, validationValueFormatterRegistry);
    }
    public build(controlId: string, errorKey: string, error: ValidationError): string {
        const errorMessage: string = this.getErrorMessage(controlId, errorKey, error);
        const valueFormatter = this.validationValueFormatterRegistry.getFormatter(error.type);
        const maxValue = valueFormatter.format((<RangeValidationError>error).maxValue);
        return errorMessage.replace('%1', maxValue);
    }
}
