import { Component, Injector } from '@angular/core';

import { InsuredDTO, PolicyDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';
import { ViewModel } from 'life-core/view-model';

import { ApplicantListHelper } from 'business/policy/shared';

@Component({
    selector: 'applicant-personal-info',
    templateUrl: './applicant-personal-info.component.html',
    providers: [PolicySubscriber]
})
export class ApplicantPersonalInfoComponent extends ViewModel {
    public applicant: InsuredDTO;
    private _policy: PolicyDTO;
    private _applicantListHelper: ApplicantListHelper;

    constructor(injector: Injector, policySubscriber: PolicySubscriber, applicantListHelper: ApplicantListHelper) {
        super(injector);
        this._applicantListHelper = applicantListHelper;
        policySubscriber.subscribe(this, policy => {
            this._policy = policy;
        });
    }

    public loadData(): Promise<void> {
        this.setApplicant();
        this.setResolvedListData();
        this.setResolvedMetaData();
        return Promise.resolve();
    }

    public onBirthCountryChange(): void {
        this.resetBirthStateValue();
    }

    private setApplicant(): void {
        this.applicant = this._applicantListHelper.getActiveApplicantOrDefault(this._policy.Insureds_LazyLoad);
    }

    private resetBirthStateValue(): void {
        this.applicant.Applications_LazyLoad[0].BirthState = '';
    }
}
