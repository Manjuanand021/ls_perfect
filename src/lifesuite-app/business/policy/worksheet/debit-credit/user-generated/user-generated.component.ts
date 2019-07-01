import { Component, Injector } from '@angular/core';
import { ViewModel } from 'life-core/view-model';
import { ActiveApplicantHelper, ApplicantListHelper } from 'business/policy/shared';
import { InsuredDTO, PolicyDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

@Component({
    selector: 'user-generated',
    templateUrl: './user-generated.component.html',
    providers: [PolicySubscriber]
})
export class UserGeneratedComponent extends ViewModel {
    public insured: InsuredDTO;
    private _applicantListHelper: ApplicantListHelper;
    private _policy: PolicyDTO;
    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        activeApplicantHelper: ActiveApplicantHelper,
        applicantListHelper: ApplicantListHelper
    ) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this._policy = p;
        });
        this._applicantListHelper = applicantListHelper;

        this.subscriptionTracker.track(
            activeApplicantHelper.activeApplicantIdObservable.subscribe(applicantId => {
                this.setApplicant();
            })
        );
    }

    private setApplicant(): void {
        this.insured = this._applicantListHelper.getActiveApplicantOrDefault(this._policy.Insureds_LazyLoad);
    }
}
