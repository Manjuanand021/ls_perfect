import { Injectable, Injector } from '@angular/core';
import { I18n } from 'life-core/i18n';

import { ReassignCaseBaseDelegate } from './reassign-case.base.delegate';
import { ConfirmDialog } from 'life-core/component/dialog';

@Injectable()
export class ReassignCaseDialogDelegate extends ReassignCaseBaseDelegate {
    constructor(injector: Injector, confirmDialog: ConfirmDialog, i18n: I18n) {
        super(injector, confirmDialog, i18n);
        this.i18n = i18n;
    }

    public showSameUsersDialog(): void {
        this.showConfirmDialog(this.i18n({ value: 'Reassign Case', id: 'policy.reassign.case.title'}), this.i18n({ value: 'From and To users must be different.', id: 'policy.reassign.case.msg.usersdifferent'}));
    }

    public showNoCasesSelectedDialog(): void {
        this.showConfirmDialog(this.i18n({ value: 'Reassign Case', id: 'policy.reassign.case.title'}), this.i18n({ value: 'No policies selected for reassignment.', id: 'policy.reassign.case.msg.nopoliciesselected'}));
    }

    public showNoCasesAvailableDialog(): void {
        this.showConfirmDialog(this.i18n({ value: 'Reassign Case', id: 'policy.reassign.case.title'}), this.i18n({ value: 'No policies available for reassignment.', id: 'policy.reassign.case.msg.nopoliciestoreassign'}));
    }

}