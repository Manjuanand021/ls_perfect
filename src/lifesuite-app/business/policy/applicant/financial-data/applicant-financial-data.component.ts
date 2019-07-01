import { Component, Injector } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { I18n } from 'life-core/i18n';
import { DialogButton, DialogButtonType, ConfirmDialog, DialogResult } from 'life-core/component/dialog';
import { MAX_INTEGER32 } from 'life-core/util/lang';

import { PolicyDTO, CodeHolderDTO, ApplicationInfoDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';
import { MetadataUtil } from 'ls-core/util';

import { ApplicantListHelper } from 'business/policy/shared';

@Component({
    selector: 'applicant-financial-data',
    templateUrl: './applicant-financial-data.component.html',
    providers: [PolicySubscriber]
})
export class ApplicantFinancialDataComponent extends ViewModel {
    public applicationInfo: ApplicationInfoDTO;
    public readonly maxMonthlyExpensesValue: number = MAX_INTEGER32;
    private _applicantListHelper: ApplicantListHelper;
    private _policy: PolicyDTO;
    private _confirmDialog: ConfirmDialog;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        confirmDialog: ConfirmDialog,
        applicantListHelper: ApplicantListHelper,
        i18n: I18n
    ) {
        super(injector);
        this._applicantListHelper = applicantListHelper;
        this._confirmDialog = confirmDialog;

        policySubscriber.subscribe(this, policy => {
            this._policy = policy;
        });
        this.applicationInfo = new ApplicationInfoDTO();
        this.i18n = i18n;
    }

    protected setupData(): void {
        this.setResolvedListData();
        this.setResolvedMetaData();
        this.setApplicationInfo();
    }

    public onOccupationCodeBlur(occupationCode: any): void {
        if (occupationCode.currentTarget.value) {
            const codeHolderDTO: CodeHolderDTO = MetadataUtil.getItemByExternalCode(
                this.listData.occupation,
                occupationCode.currentTarget.value
            );
            if (codeHolderDTO && codeHolderDTO.CodeId) {
                this.applicationInfo.Occupation = codeHolderDTO.CodeId;
            } else {
                this.showOccupationCodeNotDefinedMessageDialog().then(result => {
                    if (result.buttonId === DialogButtonType.OK) {
                        this.setFocusOnOccupationCode();
                    }
                    this.resetOccupationFields();
                });
            }
        }
    }

    private setApplicationInfo(): void {
        const activeApplicant = this._applicantListHelper.getActiveApplicantOrDefault(this._policy.Insureds_LazyLoad);
        if (activeApplicant.Applications_LazyLoad && activeApplicant.Applications_LazyLoad.length) {
            this.applicationInfo = activeApplicant.Applications_LazyLoad[0];
        }
    }

    private showOccupationCodeNotDefinedMessageDialog(): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: this.i18n({
                value: 'Occupation code is not defined. Please contact your administrator.',
                id: 'sso.errmessage'
            }),
            title: this.i18n({ value: 'Information', id: 'applicant.coverage.message.title' }),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    private setFocusOnOccupationCode(): void {
        const formInput = this.getFormInputs().find(formInput => formInput.control.name === 'occupationCode');
        formInput.control.setFocus();
    }

    private resetOccupationFields(): void {
        this.applicationInfo.Occupation = '';
        this.applicationInfo.OccupationCode = '';
    }
}
