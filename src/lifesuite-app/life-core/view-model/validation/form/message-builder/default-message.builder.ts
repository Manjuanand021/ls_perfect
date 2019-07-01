import { Injectable } from '@angular/core';

import { ValidationError } from 'life-core/component/input';
import { ValidationMessageBuilder } from './validation-message.builder';
import { ValidationValueFormatterRegistry } from '../validation-value-formatter.registry';
import { ValidationMessageService } from '../validation-message.service';

@Injectable({
    providedIn: 'root'
})
export class DefaultMessageBuilder extends ValidationMessageBuilder {
    constructor(
        validationMessageService: ValidationMessageService,
        validationValueFormatterRegistry: ValidationValueFormatterRegistry
    ) {
        super(validationMessageService, validationValueFormatterRegistry);
    }

    public build(controlId: string, errorKey: string, error: ValidationError): string {
        return this.getErrorMessage(controlId, errorKey, error);
    }
}
