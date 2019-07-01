import { Injectable } from '@angular/core';

import { ReassignCaseBaseDelegate } from 'business/reassign-case/delegates/reassign-case.base.delegate';

@Injectable()
export class ReassignSelectedCasesDelegate extends ReassignCaseBaseDelegate {
    public reassignToUser(fromUser: number, toUser: number, policyIDsList: number[]): Promise<boolean> {
        return this._reassignCasesService
            .submitReassignCases(fromUser, toUser, policyIDsList)
            .then((result: boolean) => {
                this.onReassignSelectedCasesResultReceived(result);
                return result;
            });
    }
}
