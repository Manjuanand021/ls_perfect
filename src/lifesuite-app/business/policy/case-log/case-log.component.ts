import { Component, Injector } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization/authorization.provider';
import { IDialogViewModel, DialogViewModelResult } from 'life-core/component/dialog/shared/dialog.interface';
import { DetailViewModel } from 'life-core/component/master-detail/view-model/detail.vm';
import { ParentChildRegistry } from 'life-core/view-model/parent-child-registry/parent-child-registry';
import { TabStateManager } from 'life-core/util/tab-state/tab-state.manager';

import { LogEntryProxyDTO } from 'ls-core/model/dto/log-entry-proxy.dto';

import { CaseAuthorizationProvider } from 'business/policy/shared/authorization';

@Component({
    selector: 'case-log',
    templateUrl: './case-log.component.html',
    providers: [
        ParentChildRegistry,
        TabStateManager,
        { provide: AuthorizationProvider, useClass: CaseAuthorizationProvider }
    ]
})
export class CaseLogComponent extends DetailViewModel<LogEntryProxyDTO> implements IDialogViewModel {
    constructor(injector: Injector) {
        super(injector);
    }

    public setModel(model: any): void {
        this.data = model.resolvedData;
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        return Promise.resolve(null);
    }
}
