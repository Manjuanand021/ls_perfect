import { Component, Injector, Injectable } from '@angular/core';

import { ViewModel, ParentChildRegistry, ViewValidationResult } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';
import { IDialogViewModel, DialogData, DialogButtonType } from 'life-core/component/dialog';
import { DialogViewModelResult } from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization/authorization.provider';

import {
    DataServiceParams,
    DataService,
    UIServiceNames,
    UIServiceMethods,
    SavePolicyDataDelegate
} from 'ls-core/service';
import { PolicyDTO, CoverageDTO } from 'ls-core/model';
import { AppSession } from 'ls-core/session';

import { CoverageAuthorizationProvider } from './../coverage-authorization.provider';

@Component({
    selector: 'reopen-coverage.component',
    templateUrl: './reopen-coverage.component.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: CoverageAuthorizationProvider }]
})
@Injectable()
export class ReopenCoverageComponent extends ViewModel implements ICompose, IDialogViewModel {
    public resolvedData: any;
    public reopenReason: string;
    public isReasonListRequired: boolean;
    private _dataService: DataService;
    private _appSession: AppSession;
    private _coverage: CoverageDTO;

    constructor(injector: Injector, appSession: AppSession, dataService: DataService) {
        super(injector);
        this._dataService = dataService;
        this._appSession = appSession;
    }

    public setModel(model: DialogData) {
        this.resolvedData = model.resolvedData;
        this._coverage = model.parameterData;
    }

    public ngAfterContentInit(): void {
        super.ngAfterContentInit();
        this.setReasonListAccessibility();
    }

    private setReasonListAccessibility(): void {
        this.isReasonListRequired =
            this.resolvedData.metaData['system'].find(item => item.value == 'CaseReopenReasonRequired').label == 'true';
    }

    public getDataToSave(): any {
        return this.policy;
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.ACCEPT) {
            return this.validate().then(result => {
                if (result == ViewValidationResult.pass) {
                    return this.saveAndReopenCoverage();
                } else {
                    return new DialogViewModelResult(null, false);
                }
            });
        } else {
            return Promise.resolve(null);
        }
    }

    private saveAndReopenCoverage(): Promise<DialogViewModelResult> {
        return this.saveData().then(() => {
            return this.reopenCoverage();
        });
    }

    private reopenCoverage(): Promise<DialogViewModelResult> {
        const serviceParams: DataServiceParams = this.getReopenCoverageServiceParams();
        return this._dataService.getData(serviceParams).then(response => {
            const reopenCoverageResponse = response.responsePayload as ReopenCaseResponse;
            return new DialogViewModelResult({ updatedPolicy: reopenCoverageResponse.policyDTO });
        });
    }

    private getReopenCoverageServiceParams(): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.REOPEN_CASE_DATA_SERVICE,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: this.getReopenCoverageServicePayload()
        });
    }

    private getReopenCoverageServicePayload(): ReopenCaseRequest {
        let request = new ReopenCaseRequest();
        request.policyDTO = this.policy;
        request.insuredID = this._coverage.PolicyPersonId as number;
        request.coverageID = this._coverage.PolicyCoverageId as number;
        request.reasonText = this.reopenReason;
        return request;
    }

    private get policy(): PolicyDTO {
        return this._appSession.policyDTO;
    }
}

export class ReopenCaseRequest {
    readonly $type: string = 'life.ls.ui.ria.dto.requests.ReopenCaseRequest, LifeSuite.UIServiceDTO';

    public policyDTO: PolicyDTO;
    public insuredID: number;
    public coverageID: number;
    public reasonText: string;
}

export class ReopenCaseResponse {
    readonly $type: string = 'life.ls.ui.ria.dto.responses.ReopenCaseResponse, LifeSuite.UIServiceDTO';

    public policyDTO: PolicyDTO;
}
