import { Injectable } from '@angular/core';

import { ReassignCaseBaseDelegate } from 'business/reassign-case/delegates/reassign-case.base.delegate';

@Injectable()
export class ReassignAllCasesDelegate extends ReassignCaseBaseDelegate {
    public reassignCases(fromUser: number, toUser: number): Promise<boolean> {
        return this._reassignCasesService.submitReassignAllCases(fromUser, toUser).then((result: boolean) => {
            this.onReassignAllCasesResultReceived(result);
            return result;
        });
    }
}
