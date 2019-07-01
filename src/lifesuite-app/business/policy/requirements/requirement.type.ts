import { Injectable } from '@angular/core';
import { I18n } from 'life-core/i18n';

@Injectable()
export class RequirementTypes {
    public lab: string;
    public mvr: string;

    protected i18n: I18n;

    constructor(i18n: I18n) {
        this.i18n = i18n;
        this.lab = this.i18n({ value: 'LAB', id: 'policy.requirement.requirementtype.lab' });
        this.mvr = this.i18n({ value: 'MVR', id: 'policy.requirement.requirementtype.mvr' });
    }
}
