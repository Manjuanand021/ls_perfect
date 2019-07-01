import { Component, Injector } from '@angular/core';

import { SecondaryTabHostViewModel } from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';

import { AttachmentsAuthorizationProvider } from 'business/policy/documents/attachments/attachments-authorization.provider';

@Component({
    selector: 'case-attachments',
    templateUrl: './case-attachments.component.html',
    providers: [{ provide: AuthorizationProvider, useClass: AttachmentsAuthorizationProvider }]
})
export class CaseAttachmentsComponent extends SecondaryTabHostViewModel {
    constructor(injector: Injector) {
        super(injector);
    }

    public loadData(): Promise<void> {
        this.setResolvedData('caseAttachments');
        return Promise.resolve();
    }
}
