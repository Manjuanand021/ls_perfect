import { Component, Injector, Injectable, Input } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

import { FormLayoutConfig, FormFieldEvent, FormListFieldsUtil } from 'life-core/component/dynamic-form';
import { AuthorizationProvider } from 'life-core/authorization';
import { ModalDialog, DialogButtonType, DialogButton, DialogSize, ButtonActionType } from 'life-core/component';
import { ResolvedDataNames } from 'life-core/view-model';
import { ObjectUtil } from 'life-core/util/lang';
import { I18n } from 'life-core/i18n';

import { LsDynamicFormViewModel, FormLoadDynamicMetadataService } from 'ls-core/component/dynamic-form';
import { PolicyDTO, CoverageDTO, PolicyCoverageDTO } from 'ls-core/model';
import { PolicySubscriber, AppSession } from 'ls-core/session';

import { CoverageFormDataBuilder } from 'business/policy/shared/coverage-dynamic-form';
import { CoverageStatuses, UserPolicyService } from 'business/policy/shared';
import { PlanWorksheetCoverageFormFields } from 'business/policy/worksheet/case-disp/coverage/form';
import {
    ReopenCoverageComponent,
    ReopenCoverageMetaDataResolver
} from 'business/policy/worksheet/case-disp/coverage/reopen-coverage';
import { SavePolicyDataDelegate } from 'ls-core/service';
import { ChangeCoverageDispositionComponent, ChangeCoverageDispositionListDataResolver } from './change-coverage-disp';
import { CoverageAuthorizationProvider } from './coverage-authorization.provider';
import { SectionAvailabilityHelper } from 'business/policy/shared';
import { PolicyApprovalAuthorizationDelegate } from '../policy-approval-authorization.delegate';

@Component({
    selector: 'ls-worksheet-coverage',
    templateUrl: './worksheet-coverage.component.html',
    providers: [
        PolicySubscriber,
        UserPolicyService,
        PolicyApprovalAuthorizationDelegate,
        { provide: AuthorizationProvider, useClass: CoverageAuthorizationProvider }
    ]
})
@Injectable()
export class WorksheetCoverageComponent extends LsDynamicFormViewModel {
    @Input()
    public coverage: CoverageDTO;
    @Input()
    public index: string;
    public disabledBasedOnCoverageStatus: boolean;
    public formLayoutConfig: FormLayoutConfig = {
        fieldsPerRow: 4
    };
    public panelHeader: string;
    public showBenefitSection: boolean;
    public showAmendmentSection: boolean;
    public showReinsurerSection: boolean;
    public showImpairmentSection: boolean;
    public canReopenCoverage: boolean;
    public reopenCaseButtonActionType: ButtonActionType = ButtonActionType.DataChange;
    protected policy: PolicyDTO;
    protected policyCoverage: PolicyCoverageDTO;
    private _planWorksheetCoverageFormFields: PlanWorksheetCoverageFormFields;
    private _formLoadDynamicMetadataService: FormLoadDynamicMetadataService;
    private _modalDialog: ModalDialog;
    private _appSession: AppSession;
    private _applyToAllBenefits: boolean;
    private _policyApprovalAuthorizationDelegate: PolicyApprovalAuthorizationDelegate;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        policyApprovalAuthorizationDelegate: PolicyApprovalAuthorizationDelegate,
        planWorksheetCoverageFormFields: PlanWorksheetCoverageFormFields,
        formLoadDynamicMetadataService: FormLoadDynamicMetadataService,
        modalDialog: ModalDialog,
        appSession: AppSession,
        i18n: I18n
    ) {
        super(injector);
        this._planWorksheetCoverageFormFields = planWorksheetCoverageFormFields;
        this._formLoadDynamicMetadataService = formLoadDynamicMetadataService;
        this.i18n = i18n;
        policySubscriber.subscribe(this, p => {
            this.policy = p;
        });
        this._modalDialog = modalDialog;
        this._appSession = appSession;
        this._policyApprovalAuthorizationDelegate = policyApprovalAuthorizationDelegate;
    }

    public ngAfterContentInit(): void {
        this.setData('coverage', this.coverage);
        this.setDisabledBasedOnCoverageStatus();
        super.ngAfterContentInit();
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        return super.loadData();
    }

    protected setupData(): void {
        this._applyToAllBenefits = false;
        this.setSectionsVisibility();
        this.setPanelHeader();
        this.setReopenButtonAvailability();
    }

    private setSectionsVisibility(): void {
        const coverageLineOfBusiness = this.getCoverageLineOfBusiness();
        this.showReinsurerSection = SectionAvailabilityHelper.isSectionVisible(
            this.listData.worksheet_section_configuration,
            coverageLineOfBusiness,
            ApplicantSections.Reinsurer
        );
        this.showAmendmentSection = SectionAvailabilityHelper.isSectionVisible(
            this.listData.worksheet_section_configuration,
            coverageLineOfBusiness,
            ApplicantSections.Amendment
        );
        this.showBenefitSection = SectionAvailabilityHelper.isSectionVisible(
            this.listData.worksheet_section_configuration,
            coverageLineOfBusiness,
            ApplicantSections.Benefit
        );
        this.showImpairmentSection = SectionAvailabilityHelper.isSectionVisible(
            this.listData.worksheet_section_configuration,
            coverageLineOfBusiness,
            ApplicantSections.Impairment
        );
    }

    private getCoverageLineOfBusiness(): string {
        return this.listData.plan_code
            .find(plan => plan.value.toUpperCase() == this.coverage.PlanCodeId.toUpperCase())
            .externalCode.toLowerCase();
    }

    private setReopenButtonAvailability(): void {
        this.canReopenCoverage = !this.isDisabledBasedOnCoverageStatus();
    }

    protected setFormData(): void {
        this.formData = CoverageFormDataBuilder.build(this.policy, this.coverage);
    }

    protected setFormFields(): Promise<void> {
        const planFormFields = this._planWorksheetCoverageFormFields.get(this.coverage.PlanCodeId.toUpperCase()) || [];
        this.formFields = this.copyFormFields(planFormFields);
        return Promise.resolve();
    }

    protected preprocessFormFields(): Promise<void> {
        this.adjustFormFieldsForCoverageStatus();
        const listFieldsWithDynamicMetaType = FormListFieldsUtil.getListFieldsWithDynamicMetaType(this.formFields);
        return this._formLoadDynamicMetadataService.load(listFieldsWithDynamicMetaType, this.coverage);
    }

    private adjustFormFieldsForCoverageStatus(): void {
        this.filterFormFieldsForCoverageStatus();
        this.disableFormFieldsForCoverageStatus();
    }

    private filterFormFieldsForCoverageStatus(): void {
        const hideBasedOnCoverageStatus = ['ChangeDisposition'];
        this.formFields = this.formFields.filter(formField => {
            return !(this.disabledBasedOnCoverageStatus && hideBasedOnCoverageStatus.indexOf(formField.name) >= 0);
        });
    }

    private disableFormFieldsForCoverageStatus(): void {
        this.formFields.forEach(formField => {
            formField.disabled = this.disabledBasedOnCoverageStatus || formField.disabled;
        });
    }

    private setDisabledBasedOnCoverageStatus(): void {
        this.disabledBasedOnCoverageStatus = this.isDisabledBasedOnCoverageStatus();
    }

    private isDisabledBasedOnCoverageStatus(): boolean {
        return (
            this.coverage.CoverageStatus == CoverageStatuses.CANCELLED ||
            this.coverage.CoverageStatus == CoverageStatuses.DECLINED ||
            this.coverage.CoverageStatus == CoverageStatuses.WITHDRAWN ||
            this.coverage.CoverageStatus == CoverageStatuses.APPROVED
        );
    }

    private setPanelHeader(): void {
        const planName = this.coverage.planName;
        const hyphenIndex = planName.indexOf('-');
        this.panelHeader = `${this.i18n(
            {
                value: 'Coverage: {{planName}}',
                id: 'policy.worksheet.coverage.title'
            },
            { planName: planName.substr(hyphenIndex + 1) }
        )}`;
    }

    protected onFormFieldEvent(event: FormFieldEvent): void {
        if (event.name == 'Product') {
            this.setFormFields();
            this.setPanelHeader();
        }
        if (event.name == 'ApplyToAllBenefits') {
            this._applyToAllBenefits = !this._applyToAllBenefits;
        }
        if (event.name == 'ChangeDisposition') {
            this.changeCoverageDisposition();
        }
    }

    private changeCoverageDisposition(): void {
        // save is needed as rules need to be run against the policy
        this.saveData().then(() => {
            this.validateUserCanApprovePolicy().then(canUserApprove => {
                if (canUserApprove) {
                    this.openChangeCoverageDispositionDialog();
                }
            });
        });
    }

    public getDataToSave(): any {
        return this.policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }

    private openChangeCoverageDispositionDialog(): Promise<NgbModalRef> {
        return this._modalDialog.open({
            view: ChangeCoverageDispositionComponent,
            data: this.coverage,
            resolve: [
                {
                    resolveName: ResolvedDataNames.listData,
                    resolverClass: ChangeCoverageDispositionListDataResolver,
                    context: this.coverage
                }
            ],
            title: this.i18n({ value: 'Change Coverage Disposition', id: 'policy.worksheet.coverageDispositionTitle' }),
            buttons: [
                new DialogButton({ type: DialogButtonType.SAVE, label: 'Accept' }),
                new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
            ]
        });
    }

    public onReopenCoverageButtonClick(): void {
        this.openReopenCoverageDialog();
    }

    private openReopenCoverageDialog(): void {
        this._modalDialog
            .open({
                view: ReopenCoverageComponent,
                data: this.coverage,
                resolve: [{ resolveName: ResolvedDataNames.metaData, resolverClass: ReopenCoverageMetaDataResolver }],
                title: this.i18n({ value: 'Reopen Coverage', id: 'policy.worksheet.coverage.reopen.title' }),
                buttons: [
                    new DialogButton({ type: DialogButtonType.ACCEPT }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ],
                size: DialogSize.small
            })
            .then(dialogRef => {
                dialogRef.result.then(result =>
                    result.buttonId == DialogButtonType.ACCEPT ? this.onCaseReopen(result.returnValue) : null
                );
            });
    }

    private onCaseReopen(coverageReopenResult: any): void {
        const policyDTO = ObjectUtil.createObjectOfType<PolicyDTO>(
            coverageReopenResult.updatedPolicy,
            PolicyDTO
        ) as PolicyDTO;
        this._appSession.updatePolicy(policyDTO);
    }

    private validateUserCanApprovePolicy(): Promise<boolean> {
        if (this.policy.UnderwriterId) {
            return this._policyApprovalAuthorizationDelegate.validate(
                this.data.coverage.PolicyPersonId,
                this.authorizationData.getLevel('caseApprove'),
                this.listData['System Message']
            );
        }
    }
}

const ApplicantSections = {
    Reinsurer: 'reinsurer',
    Amendment: 'amendment',
    Benefit: 'benefit',
    Impairment: 'impairment'
};
