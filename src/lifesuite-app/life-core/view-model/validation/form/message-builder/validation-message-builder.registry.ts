import { InjectionToken } from '@angular/core';

import { DefaultMessageBuilder } from './default-message.builder';
import { MinErrorMessageBuilder } from './min-error-message.builder';
import { MaxErrorMessageBuilder } from './max-error-message.builder';
import { ValidationMessageBuilderRegistryType } from './validation-message-builder.type';

export const VALIDATION_MESSAGE_BUILDER_REGISTRY = new InjectionToken<ValidationMessageBuilderRegistryType>(
    'validation.message.builder.registry'
);

export const LfValidationMessageBuilderRegistry: ValidationMessageBuilderRegistryType = {
    minError: MinErrorMessageBuilder,
    maxError: MaxErrorMessageBuilder,
    required: DefaultMessageBuilder,
    invalidDate: DefaultMessageBuilder,
    invalidValue: DefaultMessageBuilder,
    invalidInch: DefaultMessageBuilder,
    invalidUSZipCode: DefaultMessageBuilder,
    invalidCanadaPostalCode: DefaultMessageBuilder,
    invalidTaxId: DefaultMessageBuilder,
    invalidStartDate: DefaultMessageBuilder,
    invalidEndDate: DefaultMessageBuilder,
    invalidDateRange: DefaultMessageBuilder
};
