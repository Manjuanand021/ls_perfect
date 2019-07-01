import { Injector, Input } from '@angular/core';
import { InsuredDTO } from 'ls-core/model';
import { BasePolicyGridViewModel } from 'business/policy/shared';
import { ActiveApplicantHelper, ApplicantListHelper } from 'business/policy/shared';

export abstract class BaseDebitCreditGridViewModel<T> extends BasePolicyGridViewModel<T> {
    @Input() public insured: InsuredDTO;

    public total: number;

    private _applicantListHelper: ApplicantListHelper;

    constructor(injector: Injector) {
        super(injector);
        this._applicantListHelper = injector.get(ApplicantListHelper);
        const activeApplicantHelper = injector.get(ActiveApplicantHelper);
        this.subscriptionTracker.track(
            activeApplicantHelper.activeApplicantIdObservable.subscribe(applicantId => {
                this.setApplicant();
                this.refreshGrid();
            })
        );
    }

    private setApplicant(): void {
        this.insured = this._applicantListHelper.getActiveApplicantOrDefault(this.policy.Insureds_LazyLoad);
    }
}
