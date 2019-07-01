import { Component, Injector, Injectable } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { AuthorizationProvider } from 'life-core/authorization';
import { ListItem } from 'life-core/model';
import { ObfuscateIdUtil } from 'life-core/util';
import { DropdownActionType } from 'life-core/component/input';

import { PolicySubscriber } from 'ls-core/session';
import { PolicyDTO, InsuredDTO } from 'ls-core/model';
import { SavePolicyDataDelegate } from 'ls-core/service';

import { PolicyDataModel } from 'business/policy/shared/data-model';
import { ActiveApplicantHelper, ApplicantListHelper } from 'business/policy/shared';
import { LsRoutePath } from 'ui/routing';
import { EvidenceAuthorizationProvider } from './evidence-authorization.provider';

@Component({
    selector: 'evidence',
    templateUrl: './evidence.component.html',
    providers: [PolicySubscriber, { provide: AuthorizationProvider, useClass: EvidenceAuthorizationProvider }]
})
@Injectable()
export class EvidenceComponent extends ViewModel<PolicyDataModel> {
    public applicantList: ListItem[];
    public activeApplicant: InsuredDTO;
    public activeApplicantId: number;
    public applicantDropdownActionType: DropdownActionType = DropdownActionType.Presentation;

    private _activeApplicantHelper: ActiveApplicantHelper;
    private _applicantListHelper: ApplicantListHelper;

    constructor(
        injector: Injector,
        activeApplicantHelper: ActiveApplicantHelper,
        applicantListHelper: ApplicantListHelper,
        policySubscriber: PolicySubscriber
    ) {
        super(injector);
        this._activeApplicantHelper = activeApplicantHelper;
        this._applicantListHelper = applicantListHelper;
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
        });
    }

    public loadData(): Promise<void> {
        this.loadApplicantList();
        this.initSubscribers();
        return Promise.resolve();
    }

    private routeToEvidenceDetailSection(): void {
        this.routerAccessor.navigate(
            [LsRoutePath.EvidenceDetail, ObfuscateIdUtil.obfuscate(this.activeApplicantId.toString())],
            true
        );
    }

    private loadApplicantList(): void {
        this.applicantList = this._applicantListHelper.getApplicantList(this.data.policy.Insureds_LazyLoad);
    }

    private initSubscribers(): void {
        this.trackSubscription(
            this._activeApplicantHelper.activeApplicantIdObservable.subscribe(activeApplicantId => {
                this.setSelectedApplicant();
            })
        );
    }

    private setSelectedApplicant(): void {
        this.activeApplicantId = this._applicantListHelper.getActiveApplicantIdOrDefault(
            this.data.policy.Insureds_LazyLoad
        );
        this.activeApplicant = this._applicantListHelper.getActiveApplicantOrDefault(
            this.data.policy.Insureds_LazyLoad
        );
        this.routeToEvidenceDetailSection();
    }

    public onApplicantChange(selectedApplicant: any): void {
        this._activeApplicantHelper.setActiveApplicantId(selectedApplicant.value);
        this.activeApplicant = this.getSelectedApplicant();
        this.routeToEvidenceDetailSection();
    }

    protected rebindUIData(): void {
        this.loadApplicantList();
        this.activeApplicant = this.getSelectedApplicant();
    }

    private getSelectedApplicant(): InsuredDTO {
        return this.data.policy.Insureds_LazyLoad.find(insured => insured.PersonId == this.activeApplicantId);
    }

    protected getDataToSave(): PolicyDTO {
        return this.data.policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }
}
