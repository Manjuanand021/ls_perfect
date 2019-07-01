import { Injectable } from '@angular/core';

import { I18n } from 'life-core/i18n';
import { ValidationMessageSet, ValidationMessageRegistryType } from './validation-message.type';

export abstract class ValidationMessageRegistry {
    protected registry: ValidationMessageRegistryType;
    protected i18n: I18n;

    constructor(i18n: I18n) {
        this.i18n = i18n;
        this.setupRegistry();
    }

    public getMessageSet(validatorType: string): ValidationMessageSet {
        return this.registry[validatorType];
    }

    protected abstract setupRegistry(): void;

    protected addToRegistry(newEntries: ValidationMessageRegistryType): void {
        let newRegistry: ValidationMessageRegistryType;
        newRegistry = { ...this.registry, ...newEntries };
        Object.keys(newRegistry).forEach(key => {
            newRegistry[key] = { ...this.registry[key], ...newEntries[key] };
        });
        this.registry = newRegistry;
    }
}

@Injectable({
    providedIn: 'root'
})
export class LfValidationMessageRegistry extends ValidationMessageRegistry {
    constructor(i18n: I18n) {
        super(i18n);
    }

    protected setupRegistry(): void {
        this.registry = {
            General: {
                required: this.i18n({ value: 'Value is required.', id: 'validation.general.required' }),
                invalidValue: this.i18n({ value: 'Invalid value.', id: 'validation.general.invalidvalue' })
            },
            Text: {
                minError: this.i18n({ value: 'Minimum length is %1.', id: 'validation.text.minerror' }),
                maxError: this.i18n({ value: 'Maximum length is %1.', id: 'validation.text.maxerror' })
            },
            NumberRange: {
                minError: this.i18n({ value: 'Minimum value is %1.', id: 'validation.number.minerror' }),
                maxError: this.i18n({ value: 'Maximum value is %1.', id: 'validation.number.maxerror' })
            },
            DateRange: {
                minError: this.i18n({ value: 'Minimum date is %1.', id: 'validation.date.minerror' }),
                maxError: this.i18n({ value: 'Maximum date is %1.', id: 'validation.date.maxerror' }),
                invalidDate: this.i18n({ value: 'Invalid date.', id: 'validation.date.invalidvalue' }),
                invalidDateRange: this.i18n({ value: 'Invalid date range', id: 'validation.date.invalidrange' }),
                invalidStartDate: this.i18n({ value: 'Invalid start date', id: 'validation.date.invalidstartdate' }),
                invalidEndDate: this.i18n({ value: 'Invalid end date', id: 'validation.date.invalidenddate' })
            },
            HeightRange: {
                invalidInch: this.i18n({
                    value: 'Inches must be between 0 & 11.',
                    id: 'validation.height.invalidvalue'
                })
            },
            ZipCode: {
                invalidUSZipCode: this.i18n({
                    value: 'US postal code should be in the format 99999-9999',
                    id: 'validation.postalcode.usa.alertmessage'
                }),
                invalidCanadaPostalCode: this.i18n({
                    value: "Canadian postal code should be in the format 'A9A 9A9'",
                    id: 'validation.postalcode.canada.alertmessage'
                })
            },
            TaxId: {
                invalidTaxId: this.i18n({
                    value: `Tax ID should be in the format 999-99-9999 and can't start with 9 or 666 or have all '0' group.`,
                    id: 'validation.taxid.format.alertmessage'
                })
            }
        };
    }
}
