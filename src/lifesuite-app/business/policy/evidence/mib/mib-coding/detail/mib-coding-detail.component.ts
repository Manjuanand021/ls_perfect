import { Component, Injector } from '@angular/core';

import { AppSession } from 'ls-core/session/app-session';
import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { ParentChildRegistry } from 'life-core/view-model';
import { AuthorizationProvider } from 'life-core/authorization';

import { MetadataUtil, DBDateUtil } from 'ls-core/util';
import { MIBCodingDTO } from 'ls-core/model';

import { MibDetailAuthorizationProvider } from './../../mib-detail-authorization.provider';

@Component({
    selector: 'other-risks-detail-editor',
    templateUrl: './mib-coding-detail.component.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: MibDetailAuthorizationProvider }]
})
export class MIBCodingDetailDialogEditor extends BasePolicyDialogDetailViewModel<MIBCodingDTO> {
    public userName: string;

    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    protected setupData(): void {
        this.setupUserData();
        this.setDefaultDate();
    }

    private setupUserData(): void {
        if (!this.data.AddedBy) {
            this.data.AddedBy = MetadataUtil.getItemCodeByLabel(this.resolvedData.metaData.aus_users, this._appSession
                .user.UserId as string);
        }
    }

    private setDefaultDate(): void {
        const dateAdded = this.data.DateAdded;
        // set today's date as default date when DateAdded does not exit
        if (!dateAdded || (dateAdded && !dateAdded.dateAndTimeAsString)) {
            this.data.DateAdded = DBDateUtil.dateToDBDate(new Date());
        }
    }
}
