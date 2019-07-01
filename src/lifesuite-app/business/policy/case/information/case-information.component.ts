import { Component, Injector } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { AuthorizationProvider } from 'life-core/authorization';
import { ConfirmDialog, DialogButton, DialogButtonType, DialogResult } from 'life-core/component';
import { I18n } from 'life-core/i18n';
import { InputValueValidationResult } from 'life-core/view-model/validation/input-value';

import { PolicySubscriber } from 'ls-core/session';
import { DBDateUtil, MetadataUtil } from 'ls-core/util';

import { PolicyDataModel } from 'business/policy/shared/data-model';
import { CaseInfoAuthorizationProvider } from './case-info-authorization.provider';
import { ApplicationReceivedDateValidator } from '../../shared/validator/application-received-date-validator';
import { AgentSignedDateValidator } from '../../shared/validator/agent-signed-date-validator';
import { UserPolicyService } from 'business/policy/shared/user-policy.service';


@Component({
    selector: 'case-information',
    templateUrl: './case-information.component.html',
    providers: [
        PolicySubscriber,
        UserPolicyService,
        ConfirmDialog,
        ApplicationReceivedDateValidator,
        AgentSignedDateValidator,
        { provide: AuthorizationProvider, useClass: CaseInfoAuthorizationProvider }
    ]
})
export class CaseInformationComponent extends ViewModel<PolicyDataModel> {
    private _confirmDialog: ConfirmDialog;
    private _userPolicyService: UserPolicyService;
    private _applicationReceivedDateValidator: ApplicationReceivedDateValidator;
    private _agentSignedDateValidator: AgentSignedDateValidator;
    public disabledTeam: boolean;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        userPolicyService: UserPolicyService,
        confirmDialog: ConfirmDialog,
        i18n: I18n,
        applicationReceivedDateValidator: ApplicationReceivedDateValidator,
        agentSignedDateValidator: AgentSignedDateValidator
    ) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
        });
        this._userPolicyService = userPolicyService;
        this._confirmDialog = confirmDialog;
        this.i18n = i18n;
        this._applicationReceivedDateValidator = applicationReceivedDateValidator;
        this._agentSignedDateValidator = agentSignedDateValidator;
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.setResolvedListData();
        this.setDisableTeam();
        return Promise.resolve();
    }

    public onUnderwriterChange(selectedUnderwriter: any): void {
        if (selectedUnderwriter.value) {
            this._userPolicyService.canUserApprovePolicy(selectedUnderwriter.value, true).then(canUserApprove => {
                if (!canUserApprove) {
                    this.displayValidationFailWarningDialog();
                }
            });
        }
    }

    public onApplicationReceivedDateChange(): void {
        if (this.applicationReceivedDateExists()) {
            this.validateApplicationReceivedDate();
        }
    }

    private validateApplicationReceivedDate(): void {
        if (this._applicationReceivedDateValidator.validate() === InputValueValidationResult.fail) {
            this.showValidationMsgDialog().then(() => {
                this.resetApplicationReceivedDate();
            });
        }
    }

    private applicationReceivedDateExists(): boolean {
        return DBDateUtil.isDateSet(this.data.policy.ReceiveDate);
    }

    public onAgentSignedDateChange(): void {
        this.validateAgentSignedDate();
    }

    private validateAgentSignedDate(): void {
        if (this._agentSignedDateValidator.validate() === InputValueValidationResult.fail) {
            this.showValidationMsgDialog().then(() => {
                this.resetAgentSignedDate();
            });
        }
    }

    private setDisableTeam(): void {
        const teamEnabled = MetadataUtil.getLabelByValue(this.listData['system'], 'AllowTeamReassign');
        this.disabledTeam = !(teamEnabled && teamEnabled.toUpperCase() == 'TRUE');
    }

    private resetAgentSignedDate(): void {
        this.data.policy.AgentSignedDate = null;
    }

    private resetApplicationReceivedDate(): void {
        this.data.policy.ReceiveDate = null;
    }

    private showValidationMsgDialog(): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: this.i18n({
                value: 'Application Received Date/Agent Signed Date cannot be prior to Birth date.',
                id: 'policy.caseinfo.dialog.datevalidation.message'
            }),
            title: this.i18n({ value: 'Validation message', id: 'policy.caseinfo.dialog.datevalidation.title' }),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    private displayValidationFailWarningDialog(): void {
        this._confirmDialog
            .open({
                message: this.getWarningDialogMessage(),
                title: this.i18n({ value: 'Warning', id: 'policy.caseinfo.dialog.underwriter.title' }),
                buttons: [
                    new DialogButton({ type: DialogButtonType.OK }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ]
            })
            .then(result => {
                if (result.buttonId !== DialogButtonType.OK) {
                    this.resetUnderwriterField();
                }
            });
    }

    private getWarningDialogMessage(): string {
        return this.i18n({
            value:
                'Underwriter does not have sufficient authority to approve coverage on this case.\nSelect Yes to proceed or Cancel to select another underwriter.',
            id: 'policy.caseinfo.dialog.underwriter.message'
        });
    }

    private resetUnderwriterField(): void {
        this.data.policy.UnderwriterId = '';
    }
}
