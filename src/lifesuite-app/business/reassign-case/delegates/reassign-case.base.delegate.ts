import { Injectable, Injector } from '@angular/core';

import { DialogButtonType, DialogButton, ConfirmDialog, DialogResult } from 'life-core/component';
import { I18n } from 'life-core/i18n';
import { ReassignCasesService } from 'business/reassign-case/services/reassign-case.service';

@Injectable()
export class ReassignCaseBaseDelegate {
    public _reassignCasesService: ReassignCasesService;
    protected i18n: I18n;
    private _confirmDialog: ConfirmDialog;

    constructor(injector: Injector, confirmDialog: ConfirmDialog, i18n: I18n) {
        this._confirmDialog = confirmDialog;
        this._reassignCasesService = injector.get(ReassignCasesService);
        this.i18n = i18n;
    }

    public showConfirmDialog(title: string, message: string): Promise<DialogResult> {
        return this._confirmDialog.open({
            message: message,
            title: title,
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }

    public onReassignAllCasesResultReceived(result: boolean): void {
        let title = '';
        let message = '';
        if (result) {
            title = this.i18n({ value: 'Reassign Case', id: 'policy.reassign.case.title' });
            message = this.i18n({
                value: 'All policies are successfully reassigned.',
                id: 'policy.reassign.case.msg.allreassigned'
            });
        } else {
            title = this.i18n({ value: 'Information', id: 'general.message.infotitle' });
            message = this.i18n({
                value: 'Unsuccessful service call.',
                id: 'policy.documents.templates.msgunsuccessful'
            });
        }
        this.showConfirmDialog(title, message);
    }

    public onReassignSelectedCasesResultReceived(result: boolean): void {
        let title = '';
        let message = '';
        if (result) {
            title = this.i18n({ value: 'Reassign Case', id: 'policy.reassign.case.title' });
            message = this.i18n({
                value: 'Selected policies are successfully reassigned.',
                id: 'policy.reassign.case.msg.selectedreassigned'
            });
        } else {
            title = this.i18n({ value: 'Information', id: 'general.message.infotitle' });
            message = this.i18n({
                value: 'Unsuccessful service call.',
                id: 'policy.documents.templates.msgunsuccessful'
            });
        }
        this.showConfirmDialog(title, message);
    }
}
