import { Injectable } from '@angular/core';

import { LfValidationMessageRegistry, ValidationMessageRegistryType } from 'life-core/view-model';
import { I18n } from 'life-core/i18n';

@Injectable()
export class LsValidationMessageRegistry extends LfValidationMessageRegistry {
    constructor(i18n: I18n) {
        super(i18n);
    }

    protected setupRegistry(): void {
        super.setupRegistry();
        const lsRegistryEntries: ValidationMessageRegistryType = {
            DateRange: {
                invalidDate_birthDate: this.i18n({
                    value: 'Invalid birth date.',
                    id: 'validation.date.invalidbirthdate'
                })
            }
        };
        this.addToRegistry(lsRegistryEntries);
    }
}
