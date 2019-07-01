import { Injectable } from '@angular/core';

import { ModalDialog, DialogButton, DialogButtonType, DialogSize } from 'life-core/component';
import { ResolvedDataNames } from 'life-core/view-model';
import { I18n } from 'life-core/i18n';

import { AppSession } from 'ls-core/session';

import { CaseLogComponent } from 'business/policy/case-log/case-log.component';
import { CaseLogMetaDataResolver } from 'business/policy/case-log/filter/case-log-metadata.resolver';

@Injectable()
export class OpenCaseLogViewDelegate {
    private _appSession: AppSession;
    private _modalDialog: ModalDialog;
    private i18n: I18n;

    constructor(modalDialog: ModalDialog, appSession: AppSession, i18n: I18n) {
        this._modalDialog = modalDialog;
        this._appSession = appSession;
        this.i18n = i18n;
    }

    public openView(): void {
        this._modalDialog.open({
            view: CaseLogComponent,
            title: this.i18n({ value: 'Case Log View', id: 'policy.case.log.headertitle' }),
            buttons: [
                new DialogButton({
                    type: DialogButtonType.CANCEL,
                    label: this.i18n({ value: 'Close', id: 'general.button.label.close' }),
                    options: { isDefault: true }
                })
            ],
            data: this._appSession.policyDTO.PolicyId,
            resolve: [{ resolveName: ResolvedDataNames.metaData, resolverClass: CaseLogMetaDataResolver }],
            size: DialogSize.large
        });
    }
}
