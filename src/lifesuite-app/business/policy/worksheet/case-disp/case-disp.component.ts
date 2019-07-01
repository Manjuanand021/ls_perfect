import { Component, Injector } from '@angular/core';

import { SecondaryTabHostViewModel } from 'life-core/component/layout/tabview';
import { I18n } from 'life-core/i18n';
import { ModalDialog, DialogButton, DialogButtonType } from 'life-core/component';
import { ResolvedDataNames } from 'life-core/view-model';
import { ListUtil } from 'life-core/util';
import { AuthorizationProvider } from 'life-core/authorization/authorization.provider';

import { SavePolicyDataDelegate } from 'ls-core/service';
import { PolicySubscriber, AppSession } from 'ls-core/session';
import { LsRadioButtonValues, LsRadioButtonValuesType } from 'ls-core/component/input';

import { UserPolicyService, PolicyStatusCodes } from 'business/policy/shared';
import { CaseAuthorizationProvider } from 'business/policy/shared/authorization';
import { PolicyApprovalAuthorizationDelegate } from 'business/policy/worksheet/case-disp/policy-approval-authorization.delegate';
import {
    ChangeDispositionListDataResolver,
    ChangeDispositionComponent
} from 'business/policy/worksheet/case-disp/change-disp';
import { PolicyDataModel } from 'business/policy/shared/data-model';

@Component({
    selector: 'case-disp',
    templateUrl: './case-disp.component.html',
    providers: [
        PolicySubscriber,
        UserPolicyService,
        PolicyApprovalAuthorizationDelegate,
        { provide: AuthorizationProvider, useClass: CaseAuthorizationProvider }
    ]
})
export class CaseDispositionComponent extends SecondaryTabHostViewModel<PolicyDataModel> {
    public assignedUWName: string;
    public canChangeDisposition: boolean;
    public readonly RadioButtonValues: LsRadioButtonValuesType = LsRadioButtonValues;
    public disabledBasedOnCaseDispositionStatus: boolean;
    private _modalDialog: ModalDialog;
    private _policyApprovalAuthorizationDelegate: PolicyApprovalAuthorizationDelegate;
    private _appSession: AppSession;
    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        modalDialog: ModalDialog,
        policyApprovalAuthorizationDelegate: PolicyApprovalAuthorizationDelegate,
        appSession: AppSession,
        i18n: I18n
    ) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
            this.setCaseDispositionLinkAvailability();
            this.setDisableBasedOnCaseStatus();
        });
        this._modalDialog = modalDialog;
        this._appSession = appSession;
        this._policyApprovalAuthorizationDelegate = policyApprovalAuthorizationDelegate;
        this.i18n = i18n;
    }

    public ngAfterContentInit(): void {
        super.ngAfterContentInit();
        this.setCaseDispositionLinkAvailability();
        this.setDisableBasedOnCaseStatus();
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.setResolvedListData();
        this.setAssignedUnderwriter();
        return Promise.resolve();
    }

    private setDisableBasedOnCaseStatus(): void {
        this.disabledBasedOnCaseDispositionStatus = this.data.policy.PolicyStatusCode === PolicyStatusCodes.CLOSED;
    }

    private setCaseDispositionLinkAvailability(): void {
        this.canChangeDisposition = this.data.policy.PolicyStatusCode != PolicyStatusCodes.CLOSED;
    }

    public setAssignedUnderwriter(): void {
        this.assignedUWName = this.getAssignedUWName();
    }

    public getAssignedUWName(): string {
        return ListUtil.getLabelByValue(this.listData['underwriter'], this.data.policy.UnderwriterId.toString());
    }

    protected getDataToSave(): any {
        return this.data.policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }

    public onChangeDispositionClick(): void {
        this.validateUserCanApprovePolicy().then(canUserApprove => {
            if (canUserApprove) {
                this.openChangeDispositionDialog();
            }
        });
    }

    private openChangeDispositionDialog(): void {
        this._modalDialog
            .open({
                view: ChangeDispositionComponent,
                data: this.data.policy,
                resolve: [
                    { resolveName: ResolvedDataNames.listData, resolverClass: ChangeDispositionListDataResolver }
                ],
                title: this.i18n({ value: 'Change Case Disposition', id: 'policy.worksheet.caseDispositionTitle' }),
                buttons: [
                    new DialogButton({ type: DialogButtonType.SAVE, label: 'Accept' }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ]
            })
            .then(dialogRef => {
                dialogRef.result.then(result => this.logger.log('Modal dialog Result: ', result));
            });
    }

    private validateUserCanApprovePolicy(): Promise<boolean> {
        return this._policyApprovalAuthorizationDelegate.validate(
            parseInt(this._appSession.user.UserId.toString()),
            this.authorizationData.getLevel('caseApprove'),
            this.listData['System Message']
        );
    }
}
