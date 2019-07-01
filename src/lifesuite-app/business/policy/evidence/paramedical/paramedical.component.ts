import { Component, Injectable, Injector } from '@angular/core';

import { SecondaryTabHostViewModel } from 'life-core/component/layout/tabview';
import { AuthorizationProvider } from 'life-core/authorization';

import { SavePolicyDataDelegate } from 'ls-core/service';
import { PolicySubscriber } from 'ls-core/session';
import { InsuredDTO, ParamedicalDTO, PolicyDTO } from 'ls-core/model';
import { ApplicantListHelper, ActiveApplicantHelper } from 'business/policy/shared';

import { PolicyDataModel } from 'business/policy/shared/data-model';
import { ParamedicalAuthorizationProvider } from './paramedical-authorization.provider';

@Component({
    selector: 'paramedical-tab',
    templateUrl: './paramedical.component.html',
    providers: [PolicySubscriber, { provide: AuthorizationProvider, useClass: ParamedicalAuthorizationProvider }]
})
@Injectable()
export class ParamedicalTabComponent extends SecondaryTabHostViewModel<PolicyDataModel> {
    public applicant: InsuredDTO;
    private _applicantListHelper: ApplicantListHelper;
    public paramedical: ParamedicalDTO;

    constructor(injector: Injector, policySubscriber: PolicySubscriber, applicantListHelper: ApplicantListHelper) {
        super(injector);
        this._applicantListHelper = applicantListHelper;
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
        });
    }

    public loadData(): Promise<void> {
        this.setApplicant();
        this.setParamedicalData();
        return Promise.resolve();
    }

    private setApplicant(): void {
        this.applicant = this._applicantListHelper.getActiveApplicantOrDefault(this.data.policy.Insureds_LazyLoad);
    }

    private setParamedicalData(): void {
        if (this.applicant.Parameds_LazyLoad.length <= 0) {
            this.applicant.Parameds_LazyLoad.push(new ParamedicalDTO());
        }
        this.paramedical = this.applicant.Parameds_LazyLoad[0];
    }

    protected getDataToSave(): PolicyDTO {
        return this.data.policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }
}
