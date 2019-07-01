import { Injectable } from '@angular/core';

import { ValidationMessageSet } from './validation-message.type';
import { ValidationMessageRegistry } from './validation-message.registry';

export interface IValidationMessageService {
    getMessageSet(errorType: string): ValidationMessageSet;
}

@Injectable({
    providedIn: 'root'
})
export class ValidationMessageService implements IValidationMessageService {
    private _validationMessageRegistry: ValidationMessageRegistry;

    constructor(validationMessageRegistry: ValidationMessageRegistry) {
        this._validationMessageRegistry = validationMessageRegistry;
    }

    public getMessageSet(errorType: string): ValidationMessageSet {
        return this._validationMessageRegistry.getMessageSet(errorType);
    }
}
