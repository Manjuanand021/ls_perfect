import { Injector, Component } from '@angular/core';

import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { AuthorizationProvider } from 'life-core/authorization';
import { ParentChildRegistry, ViewValidationResult } from 'life-core/view-model';
import { DialogViewModelResult } from 'life-core/component';

import { BenefitPartyDTO } from 'ls-core/model';

import { ApplicantAuthorizationProvider } from 'business/policy/applicant/applicant-authorization.provider';

@Component({
    selector: 'benefit-party-detail-editor',
    templateUrl: './benefit-party-detail-editor.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: ApplicantAuthorizationProvider }]
})
export class BenefitPartyDetailEditor extends BasePolicyDialogDetailViewModel<BenefitPartyDTO> {
    public maxBirthDate: Date;

    constructor(injector: Injector) {
        super(injector);
        this.maxBirthDate = this.setBirthDateLimit();
    }

    public loadData(): Promise<void> {
        this.setResolvedListData();
        return Promise.resolve();
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (this.isDialogButtonTypeOK(buttonId)) {
            const isDirty = this.isDirty();
            return this.validate().then(result => {
                return new DialogViewModelResult(this.data, result == ViewValidationResult.pass, isDirty);
            });
        } else {
            return Promise.resolve(null);
        }
    }

    private setBirthDateLimit(): Date {
        const today = new Date().getDate();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return new Date(currentYear, currentMonth, today - 1);
    }
}
