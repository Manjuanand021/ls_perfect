import { Component, Injector } from '@angular/core';

import { ConvertUtil } from 'life-core/util/lang';
import { ListItem } from 'life-core/model';
import { SecondaryTabHostViewModel } from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';
import { DropdownActionType } from 'life-core/component/input';

import { SavePolicyDataDelegate } from 'ls-core/service';
import { PolicySubscriber } from 'ls-core/session';
import { PolicyDTO, InsuredDTO, LSFileProxyDTO } from 'ls-core/model';

import { ActiveApplicantHelper, ApplicantListHelper } from 'business/policy/shared';
import { CaseTemplatesService } from './case-templates.service';
import { MetadataUtil } from 'ls-core/util';
import { CaseAuthorizationProvider } from 'business/policy/shared/authorization';

@Component({
    selector: 'case-templates',
    templateUrl: './case-templates.component.html',
    providers: [
        PolicySubscriber,
        CaseTemplatesService,
        { provide: AuthorizationProvider, useClass: CaseAuthorizationProvider }
    ]
})
export class CaseTemplatesComponent extends SecondaryTabHostViewModel {
    public applicantList: ListItem[];
    public activeApplicantId: number;
    public caseTemplates: LSFileProxyDTO[];
    public showApplicantList: boolean;
    public applicantDropdownActionType: DropdownActionType = DropdownActionType.Presentation;

    private _activeApplicant: InsuredDTO;
    private _policy: PolicyDTO;
    private _activeApplicantHelper: ActiveApplicantHelper;
    private _applicantListHelper: ApplicantListHelper;
    private _caseTemplatesService: CaseTemplatesService;

    constructor(
        injector: Injector,
        activeApplicantHelper: ActiveApplicantHelper,
        applicantListHelper: ApplicantListHelper,
        policySubscriber: PolicySubscriber,
        caseTemplatesService: CaseTemplatesService
    ) {
        super(injector);
        this._activeApplicantHelper = activeApplicantHelper;
        this._applicantListHelper = applicantListHelper;
        this._caseTemplatesService = caseTemplatesService;
        this.caseTemplates = [];
        policySubscriber.subscribe(this, p => {
            this._policy = p;
        });
    }

    public loadData(): Promise<void> {
        this.setApplicantList();
        this.setActiveApplicant();
        this.getCaseTemplates();
        return Promise.resolve();
    }

    protected setupData(): void {
        this.setResolvedMetaData();
        this.setApplicantVisibility();
    }

    public onApplicantChange(selectedApplicant: any): void {
        this._activeApplicantHelper.setActiveApplicantId(selectedApplicant.value);
        this.setActiveApplicant();
        this.getCaseTemplates();
    }

    protected getDataToSave(): any {
        return this._policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }

    private getCaseTemplates(): void {
        this._caseTemplatesService
            .getCaseTemplates(
                ConvertUtil.toNumber(this._policy.PolicyId),
                ConvertUtil.toNumber(this._activeApplicant.PolicyPersonId)
            )
            .then(response => {
                this.setupCaseTemplates(response.fileList as LSFileProxyDTO[]);
            });
    }

    private setApplicantList(): void {
        this.applicantList = this._applicantListHelper.getApplicantList(this._policy.Insureds_LazyLoad);
    }

    private setActiveApplicant(): void {
        this.activeApplicantId = this._applicantListHelper.getActiveApplicantIdOrDefault(
            this._policy.Insureds_LazyLoad
        );
        this._activeApplicant = this._applicantListHelper.getActiveApplicantOrDefault(this._policy.Insureds_LazyLoad);
    }

    private setupCaseTemplates(caseTemplates: LSFileProxyDTO[]): void {
        this.caseTemplates = caseTemplates;
    }

    private setApplicantVisibility(): void {
        const singleApplicantCorrespondence = MetadataUtil.getLabelByValue(
            this.listData['correspondence_configuration'],
            'CRSPND_SINGLE_APPLICANT'
        );
        this.showApplicantList =
            singleApplicantCorrespondence != null && singleApplicantCorrespondence.toUpperCase() == 'TRUE';
    }
}
