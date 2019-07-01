import { Injectable, Injector } from '@angular/core';

import { I18n } from 'life-core/i18n';
import { AppSession } from 'ls-core/session';
import { DialogResult, ConfirmDialog, DialogButton, DialogButtonType } from 'life-core/component';

import { UnderwriteService } from 'business/policy/tab/services/underwriter.service';
import { PolicyDTO } from 'ls-core/model';
import { DTOObjectUtil } from 'ls-core/util';

@Injectable()
export class UnderwriteCaseDelegate {
    private _underwriteService: UnderwriteService;
    private _confirmDialog: ConfirmDialog;
    private i18n: I18n;
    private _appSession: AppSession;

    constructor(
        injector: Injector,
        underwriteService: UnderwriteService,
        confirmDialog: ConfirmDialog,
        appSession: AppSession,
        i18n: I18n
    ) {
        this._underwriteService = underwriteService;
        this._confirmDialog = confirmDialog;
        this.i18n = i18n;
        this._appSession = appSession;
    }

    public underwrite(): void {
        this._underwriteService.underwrite().then(result => {
            if (this.isPolicyUnderwritingSuccessful(result)) {
                this.updatePolicyInSession(result.policyDTO);
                this.showConfirmDialog(
                    this.i18n({ value: 'Underwrite Policy succeeded!', id: 'policytoolbar.uwpolicy.alertmsg' })
                );
            } else {
                this.showConfirmDialog(result.UnderwritingResultMsg);
            }
        });
    }

    private updatePolicyInSession(updatedPolicy: PolicyDTO): void {
        const policyDTO: PolicyDTO = DTOObjectUtil.deepConvertObjectOfType(updatedPolicy, PolicyDTO) as PolicyDTO;
        this._appSession.updatePolicy(policyDTO);
    }

    private isPolicyUnderwritingSuccessful(result: any): boolean {
        return result.UnderwritingResultMsg === '';
    }

    private showConfirmDialog(message: string): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: message,
            title: this.i18n({ value: 'Underwrite Policy', id: 'policytoolbar.uwpolicy.title' }),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }
}
