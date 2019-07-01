import { Component, Injector } from '@angular/core';

import { SecondaryTabHostViewModel } from 'life-core/component/layout/tabview';
import { ListItem } from 'life-core/model';
import { DropdownActionType } from 'life-core/component/input';

import { PolicySubscriber } from 'ls-core/session';
import { AuthorizationProvider } from 'life-core/authorization';
import { InsuredDTO, PolicyDTO } from 'ls-core/model';
import { SavePolicyDataDelegate } from 'ls-core/service';

import { ApplicantListHelper, ActiveApplicantHelper, DebitCreditHelper } from 'business/policy/shared';
import { PolicyDataModel } from 'business/policy/shared/data-model';

import { DebitCreditsChannels } from './debit-credit-channels';
import { DebitCreditAuthorizationProvider } from './debit-credit-authorization.provider';

@Component({
    selector: 'debit-credit',
    templateUrl: './debit-credit.component.html',
    providers: [PolicySubscriber, { provide: AuthorizationProvider, useClass: DebitCreditAuthorizationProvider }]
})
export class DebitCreditComponent extends SecondaryTabHostViewModel<PolicyDataModel> {
    public applicantListOptions: Array<ListItem>;
    public selectedApplicantId: number;
    public applicantDropdownActionType: DropdownActionType = DropdownActionType.Presentation;

    private _applicantListHelper: ApplicantListHelper;
    private _activeApplicantHelper: ActiveApplicantHelper;
    private _debitCreditHelper: DebitCreditHelper;
    public applicantTotalPoints: number = 0;
    public insured: InsuredDTO;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        applicantListHelper: ApplicantListHelper,
        activeApplicantHelper: ActiveApplicantHelper,
        debitCreditHelper: DebitCreditHelper
    ) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
        });
        this.applicantListOptions = new Array<ListItem>();
        this._applicantListHelper = applicantListHelper;
        this._activeApplicantHelper = activeApplicantHelper;
        this._debitCreditHelper = debitCreditHelper;
    }

    public loadData(): Promise<void> {
        this.loadApplicantList();
        this.setupDebitCreditTotalPointsSubscriptions();
        this.setApplicantTotalPoints();
        return Promise.resolve();
    }

    private loadApplicantList(): void {
        if (this.data.policy.Insureds_LazyLoad) {
            this.applicantListOptions = this._applicantListHelper.getApplicantList(this.data.policy.Insureds_LazyLoad);
        }
    }

    private setActiveApplicant(): void {
        this.selectedApplicantId = this._applicantListHelper.getActiveApplicantIdOrDefault(
            this.data.policy.Insureds_LazyLoad
        );
    }

    private setApplicantTotalPoints(): void {
        this.insured = this._applicantListHelper.getActiveApplicantOrDefault(this.data.policy.Insureds_LazyLoad);
        this.applicantTotalPoints = this._debitCreditHelper.getDebitCreditTotalPoints(this.insured);
    }

    protected setupDebitCreditTotalPointsSubscriptions(): void {
        this.subscriptionTracker.track(
            this.messagingService.subscribeNewMessageOnly(DebitCreditsChannels.DebitCredits, () =>
                this.setApplicantTotalPoints()
            )
        );
        this.trackSubscription(
            this._activeApplicantHelper.activeApplicantIdObservable.subscribe(activeApplicantId => {
                this.setActiveApplicant();
            })
        );
    }

    public onApplicantChange(selectedApplicant: any): void {
        this._activeApplicantHelper.setActiveApplicantId(selectedApplicant.value);
        this.selectedApplicantId = selectedApplicant.value;
        this.setApplicantTotalPoints();
    }

    protected getDataToSave(): PolicyDTO {
        return this.data.policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }
}
