import { Inject, Injectable, Injector } from '@angular/core';

import { ValidationError } from 'life-core/component/input';
import { VALIDATION_MESSAGE_BUILDER_REGISTRY, ValidationMessageBuilderRegistryType } from './message-builder/index';

type ControlErrors = { readonly [key: string]: any };

@Injectable({
    providedIn: 'root'
})
export class ValidationMessagesBuilder {
    protected injector: Injector;

    protected validationMessageBuilderRegistry: ValidationMessageBuilderRegistryType;

    constructor(
        injector: Injector,
        @Inject(VALIDATION_MESSAGE_BUILDER_REGISTRY)
        validationMessageBuilderRegistry: ValidationMessageBuilderRegistryType
    ) {
        this.injector = injector;
        this.validationMessageBuilderRegistry = validationMessageBuilderRegistry;
    }

    public build(controlId: string, errors: ControlErrors): string {
        const validationMessages: Array<string> = [];
        for (const key in errors) {
            const message = this.getValidationMessage(controlId, key, errors[key]);
            if (message) {
                validationMessages.push(message);
            }
        }
        return validationMessages.join('\n');
    }

    private getValidationMessage(controlId: string, errorKey: string, error: ValidationError): string {
        const validationMessageBuilder = this.validationMessageBuilderRegistry[errorKey];
        return validationMessageBuilder
            ? this.injector.get(validationMessageBuilder).build(controlId, errorKey, error)
            : null;
    }
}
