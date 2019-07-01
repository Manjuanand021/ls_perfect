import { Injectable } from '@angular/core';

import { ValidationError, RangeValidationError } from 'life-core/component/input';
import { ValidationMessageBuilder } from './validation-message.builder';
import { ValidationMessageService } from '../validation-message.service';
import { ValidationValueFormatterRegistry } from '../validation-value-formatter.registry';

@Injectable({
    providedIn: 'root'
})
export class MinErrorMessageBuilder extends ValidationMessageBuilder {
    constructor(
        validationMessageService: ValidationMessageService,
        validationValueFormatterRegistry: ValidationValueFormatterRegistry
    ) {
        super(validationMessageService, validationValueFormatterRegistry);
    }
    public build(controlId: string, errorKey: string, error: ValidationError): string {
        const errorMessage: string = this.getErrorMessage(controlId, errorKey, error);
        const valueFormatter = this.validationValueFormatterRegistry.getFormatter(error.type);
        const minValue = valueFormatter.format((<RangeValidationError>error).minValue);
        return errorMessage.replace('%1', minValue);
    }
}
