import { Injectable } from '@angular/core';

import { MetadataUtil } from 'ls-core/util';
import { DialogButtonType, DialogButton, ConfirmDialog } from 'life-core/component';
import { UserPolicyService, PolicyStatusCodes } from 'business/policy/shared';
import { AuthorizationLevel } from 'life-core/authorization';
import { I18n } from 'life-core/i18n';

import { AppSession } from 'ls-core/session';
import { MetadataItem } from 'ls-core/model/metadata/metadata.model';

@Injectable()
export class PolicyApprovalAuthorizationDelegate {
    constructor(
        private _confirmDialog: ConfirmDialog,
        private _userPolicyService: UserPolicyService,
        private _appSession: AppSession,
        private i18n: I18n
    ) {}

    public validate(
        userId: number,
        authorizationLevel: AuthorizationLevel,
        systemMessagesList: Array<MetadataItem>
    ): Promise<boolean> {
        return this._userPolicyService.canUserApprovePolicy(userId).then(canUserApprove => {
            if (authorizationLevel < AuthorizationLevel.EDIT) {
                canUserApprove = false;
            }
            if (!canUserApprove || this.isPolicyApproved()) {
                return this.showUserNotAuthorizedToApproveDialog(systemMessagesList);
            } else {
                return canUserApprove;
            }
        });
    }

    private isPolicyApproved(): boolean {
        return this._appSession.policyDTO.PolicyStatusCode === PolicyStatusCodes.APPROVED;
    }

    private showUserNotAuthorizedToApproveDialog(systemMessagesList: Array<MetadataItem>): Promise<boolean> {
        return this._confirmDialog
            .open({
                message: this.getMessage(systemMessagesList),
                title: this.i18n({ value: 'Warning', id: 'policy.policyapproval.warning.title' }),
                buttons: [
                    new DialogButton({ type: DialogButtonType.OK }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ]
            })
            .then(result => result.buttonId == DialogButtonType.OK);
    }

    private getMessage(systemMessagesList: Array<MetadataItem>): string {
        const value = MetadataUtil.getLabelByValue(systemMessagesList, 'NotAuthApprovdStatusRemove');
        return value ? value.replace(/\\n/gm, '\n') : '';
    }
}
