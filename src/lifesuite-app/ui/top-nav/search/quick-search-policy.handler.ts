import { Injectable, Injector } from '@angular/core';

import { SaveTabHandler, SaveDataDelegate } from 'life-core/handler';

import { AppSession } from 'ls-core/session/app-session';

import { QuickSearchOpenPolicyDelegate } from 'ui/top-nav/search/quick-search-open-policy.delegate';

@Injectable()
export class QuickSearchPolicyHandler extends SaveTabHandler {
    private _appSession: AppSession;
    private _openPolicyDelegate: QuickSearchOpenPolicyDelegate;
    private _policyNumber: string;

    constructor(
        injector: Injector,
        appSession: AppSession,
        openPolicyDelegate: QuickSearchOpenPolicyDelegate,
        saveDataDelegate: SaveDataDelegate
    ) {
        super(injector);
        this._appSession = appSession;
        this._openPolicyDelegate = openPolicyDelegate;
        this._saveDataDelegate = saveDataDelegate;
    }

    public execute(policyNumber?: string): void {
        this._policyNumber = policyNumber;
        if (!this.policyAlreadyOpened(policyNumber)) {
            this.saveData();
        }
    }

    private openPolicy(): void {
        this._openPolicyDelegate.searchPolicy(this._policyNumber);
    }

    private policyAlreadyOpened(policyNumber: string): boolean {
        return this._appSession.policyDTO ? this._appSession.policyDTO.PolicyNumber === policyNumber : false;
    }
    protected onSaveSucceed(): void {
        this.openPolicy();
    }

    protected onNoNeedToSave(): void {
        this.openPolicy();
    }

    protected onSaveFailed(): void {
        this.openPolicy();
    }
}
