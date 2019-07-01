import { Injectable } from '@angular/core';

import { DialogButton, DialogButtonType, ConfirmDialog } from 'life-core/component';
import { I18n } from 'life-core/i18n';

import { AppSession } from 'ls-core/session/app-session';
import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';

import { OpenPolicyDelegate } from 'business/shared/open-policy';

@Injectable()
export class QuickSearchOpenPolicyDelegate {
    private _dataService: DataService;
    private _policyNumber: string;
    private _confirmDialog: ConfirmDialog;
    private _openPolicyDelegate: OpenPolicyDelegate;
    private _appSession: AppSession;
    private i18n: I18n;

    constructor(
        DataService: DataService,
        confirmDialog: ConfirmDialog,
        openPolicyDelegate: OpenPolicyDelegate,
        appSession: AppSession,
        i18n: I18n
    ) {
        this._dataService = DataService;
        this._confirmDialog = confirmDialog;
        this._openPolicyDelegate = openPolicyDelegate;
        this._appSession = appSession;
        this.i18n = i18n;
    }

    public searchPolicy(policyNumber: string): void {
        if (!this.policyAlreadyOpened(policyNumber)) {
            this._policyNumber = policyNumber;
            const serviceParams = this.getSearchPolicyServiceParams();
            this._dataService.getData(serviceParams).then(response => {
                const searchPolicyResponse = response.responsePayload as QuickSearchPolicyResponse;
                if (searchPolicyResponse && searchPolicyResponse.foundPolicyId != 0) {
                    this.openPolicy(searchPolicyResponse);
                } else {
                    this.showErrorMessage();
                }
            });
        }
    }

    private openPolicy(searchPolicyResponse: QuickSearchPolicyResponse): void {
        this._openPolicyDelegate.openPolicy(searchPolicyResponse.foundPolicyId, searchPolicyResponse.policyNumber);
    }

    private getSearchPolicyServiceParams(): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.QUICK_SEARCH_POLICY_SERVICE,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: this.getSearchPolicyPayload()
        });
    }

    private getSearchPolicyPayload(): QuickSearchPolicyRequest {
        const request = new QuickSearchPolicyRequest();
        request.searchPolicyNumber = this._policyNumber;
        return request;
    }

    private policyAlreadyOpened(policyNumber: string): boolean {
        return this._appSession.policyDTO ? this._appSession.policyDTO.PolicyNumber === policyNumber : false;
    }

    private showErrorMessage(): void {
        this._confirmDialog.open({
            message: this.i18n({ value: 'Policy not found!', id: 'policy.quicksearch.policynotfound.dialog.message' }),
            title: this.i18n({ value: 'Search', id: 'policy.quicksearch.policynotfound.dialog.title' }),
            buttons: [new DialogButton({ type: DialogButtonType.OK })]
        });
    }
}

export class QuickSearchPolicyRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.QuickSearchPolicyRequest, LifeSuite.UIServiceDTO';

    public searchPolicyNumber: string;
}

export class QuickSearchPolicyResponse {
    public $type: string = 'life.ls.ui.ria.dto.responses.QuickSearchPolicyResponse, LifeSuite.UIServiceDTO';

    public foundPolicyId: number;
    public policyNumber: string;
}
