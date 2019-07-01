import { Component, Injector } from '@angular/core';

import { ActionsSubject } from '@ngrx/store';

import { DataSavingFlags, DataSaveStatus } from 'life-core/reducer/actions';
import { Action } from 'life-core/reducer/action';
import { PrimaryTabHostViewModel, TabChannels } from 'life-core/component/layout/tabview';
import { AuthorizationProvider } from 'life-core/authorization';
import { ParentChildRegistry } from 'life-core/view-model';
import { I18n } from 'life-core/i18n';
import { ToasterMessage, ToasterSeverity, ToasterChannels } from 'life-core/component/toaster';
import { PolicySubscriber } from 'ls-core/session';
import { PolicyDTO } from 'ls-core/model';
import { SavePolicyDataDelegate } from 'ls-core/service';

import { CaseAuthorizationProvider } from 'business/policy/shared/authorization';
import { SplitPaneToLeftMenuCommunicator } from 'ui/shared/communicator';

@Component({
    selector: 'tab-policy',
    templateUrl: './tab-policy.component.html',
    providers: [
        ParentChildRegistry,
        { provide: AuthorizationProvider, useClass: CaseAuthorizationProvider },
        PolicySubscriber,
        SplitPaneToLeftMenuCommunicator
    ]
})
export class TabPolicyComponent extends PrimaryTabHostViewModel {
    private _policy: PolicyDTO;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        actionsSubject: ActionsSubject,
        i18n: I18n,
        splitPaneToLeftMenuCommunicator: SplitPaneToLeftMenuCommunicator // Please do not delete SplitPaneToLeftMenuCommunicator
    ) {
        super(injector);
        policySubscriber.subscribeDirect(this, p => {
            this._policy = p;
        });
        this.i18n = i18n;
        this.subscribeToDataSave(actionsSubject);
    }

    protected isDataSaveNeeded(): boolean {
        return true;
    }

    protected isValidatable(): boolean {
        return true;
    }

    protected getDataToSave(): any {
        return this._policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }

    private subscribeToDataSave(actionsSubject: ActionsSubject): void {
        this.trackSubscription(
            actionsSubject.subscribe((action: Action<DataSaveStatus>) => {
                if (this.isPolicyDataSaved(action)) {
                    this.notifyPolicyDataSaved();
                }
            })
        );
    }

    private isPolicyDataSaved(action: Action<DataSaveStatus>): boolean {
        return action.type == DataSavingFlags.DATA_SAVE_STATUS && action.payload == DataSaveStatus.Succeeded;
    }

    private notifyPolicyDataSaved(): void {
        this.messagingService.publish(
            ToasterChannels.Message,
            new ToasterMessage({
                severity: ToasterSeverity.SUCCESS,
                summary: this.i18n({
                    value: 'Policy Data Saved.',
                    id: 'policy.tab.message.saved'
                })
            })
        );
    }
}
