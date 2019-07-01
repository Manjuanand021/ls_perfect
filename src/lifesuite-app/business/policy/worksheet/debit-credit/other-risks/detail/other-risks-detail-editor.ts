import { Component, Injector, Injectable } from '@angular/core';
import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { ParentChildRegistry } from 'life-core/view-model';
import { AuthorizationProvider } from 'life-core/authorization';

import { AppSession } from 'ls-core/session/app-session';
import { MetadataUtil } from 'ls-core/util';
import { WorksheetRowDTO } from 'ls-core/model';

import { OtherRisksAuthorizationProvider } from '../other-risk-authorization.provider';
@Component({
    selector: 'other-risks-detail-editor',
    templateUrl: './other-risks-detail-editor.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: OtherRisksAuthorizationProvider }]
})
@Injectable()
export class OtherRisksDialogDetailEditor extends BasePolicyDialogDetailViewModel<WorksheetRowDTO> {
    private _appSession: AppSession;
    public userName: string;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    public loadData(): Promise<void> {
        this.setUserData();
        return Promise.resolve();
    }

    private setUserData(): void {
        if (!this.data.AddedBy) {
            this.data.AddedBy = this._appSession.user.UserId;
        }
        this.userName = MetadataUtil.getItemLabelByCode(this.resolvedData.metaData.aus_users, this.data
            .AddedBy as string);
    }
}
