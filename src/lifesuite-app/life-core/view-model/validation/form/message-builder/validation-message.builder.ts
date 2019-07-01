import { ValidatorTypes, ValidationError } from 'life-core/component/input';
import { ValidationMessageSet } from '../validation-message.type';
import { IValidationMessageService, ValidationMessageService } from '../validation-message.service';
import { ValidationValueFormatterRegistry } from '../validation-value-formatter.registry';

export interface IValidationMessageBuilder {
    build(controlId: string, errorKey: string, error: ValidationError): string;
}

export abstract class ValidationMessageBuilder implements IValidationMessageBuilder {
    protected validationMessageService: IValidationMessageService;

    protected validationValueFormatterRegistry: ValidationValueFormatterRegistry;

    constructor(
        validationMessageService: ValidationMessageService,
        validationValueFormatterRegistry: ValidationValueFormatterRegistry
    ) {
        this.validationValueFormatterRegistry = validationValueFormatterRegistry;
        this.validationMessageService = validationMessageService;
    }

    public abstract build(controlId: string, errorKey: string, error: ValidationError): string;

    protected getErrorMessage(controlId: string, errorKey: string, error: ValidationError): string {
        const errorType = error.type || ValidatorTypes.General;
        const messageSet: ValidationMessageSet = this.getErrorMessageSet(errorType);
        const controlErrorKey: string = this.getControlErrorKey(errorKey, controlId);
        return messageSet[controlErrorKey] ? messageSet[controlErrorKey] : messageSet[errorKey];
    }

    protected getErrorMessageSet(errorType: string): ValidationMessageSet {
        return this.validationMessageService.getMessageSet(errorType);
    }

    protected getControlErrorKey(errorKey: string, controlId: string): string {
        const controlIdSplit = controlId ? controlId.split(ERROR_KEY_DELIMITER)[0] : '';
        return errorKey + ERROR_KEY_DELIMITER + controlIdSplit;
    }
}

export const ERROR_KEY_DELIMITER = '_';
