import { Component, Injector } from '@angular/core';

import { ViewModel, ParentChildRegistry, ViewValidationResult } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';
import { IDialogViewModel, DialogData, DialogButtonType } from 'life-core/component/dialog';
import { DialogViewModelResult } from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';

import {
    DataServiceParams,
    DataService,
    UIServiceNames,
    UIServiceMethods,
    DefaultDataService,
    SetDefaultDataRequest
} from 'ls-core/service';
import { PolicyDTO, InsuredDTO, CoverageDTO, Identifiable } from 'ls-core/model';
import { AppSession } from 'ls-core/session';

import { ApplicantListHelper, DTOAddRequest, DTOAddResponse, CoverageStatuses } from 'business/policy/shared';
import { ApplicantAuthorizationProvider } from 'business/policy/applicant/applicant-authorization.provider';

@Component({
    selector: 'add-coverage.component',
    templateUrl: './add-coverage.component.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: ApplicantAuthorizationProvider }]
})
export class AddCoverageComponent extends ViewModel implements ICompose, IDialogViewModel {
    public resolvedData: any;
    public applicant: InsuredDTO;
    public coverage: CoverageDTO;
    private _dataService: DataService;
    private _appSession: AppSession;
    private _policy: PolicyDTO;
    private _applicantListHelper: ApplicantListHelper;
    private _defaultDataService: DefaultDataService;

    constructor(
        injector: Injector,
        dataService: DataService,
        applicantListHelper: ApplicantListHelper,
        defaultDataService: DefaultDataService,
        appSession: AppSession
    ) {
        super(injector);
        this._dataService = dataService;
        this._applicantListHelper = applicantListHelper;
        this._defaultDataService = defaultDataService;
        this._appSession = appSession;
        this._policy = this._appSession.policyDTO;
        this.coverage = new CoverageDTO();
    }

    public setModel(model: DialogData): void {
        this.resolvedData = model.resolvedData;
    }

    protected setupData(): void {
        this.setApplicant();
    }

    private setApplicant(): void {
        this.applicant = this._applicantListHelper.getActiveApplicantOrDefault(this._policy.Insureds_LazyLoad);
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.ACCEPT) {
            return this.validate().then(result => {
                if (result == ViewValidationResult.pass) {
                    return this.addCoverage();
                } else {
                    return new DialogViewModelResult(null, false);
                }
            });
        } else {
            return Promise.resolve(null);
        }
    }

    private addCoverage(): Promise<DialogViewModelResult> {
        return this.setDefaultCoverageData().then(() => {
            const serviceParams: DataServiceParams = this.getAddCoverageServiceParams();
            return this._dataService.getData(serviceParams).then(response => {
                const addCoverageResponse = response.responsePayload as DTOAddResponse;
                return new DialogViewModelResult({ updatedPolicy: addCoverageResponse.rootDTOobject });
            });
        });
    }

    private setDefaultCoverageData(): Promise<void> {
        this.coverage.identifier = new Identifiable();
        const defaultDataRequest = new SetDefaultDataRequest(this._policy, this.coverage, '');
        return this._defaultDataService.setDefaultData(defaultDataRequest).then(data => {
            Object.assign(this.coverage, data.workingDTO as CoverageDTO);
            this.setAdditionalCoverageData();
        });
    }

    private setAdditionalCoverageData(): void {
        // needed as its mentioned in flex code
        // to be used if additional defaulting is required when other sections are added
        this.coverage.CoverageStatus = CoverageStatuses.PENDING;
    }

    private getAddCoverageServiceParams(): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.ADD_DTO_DATA_SERVICE,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: this.getAddCoverageServicePayload()
        });
    }

    private getAddCoverageServicePayload(): DTOAddRequest {
        const request = new DTOAddRequest();
        request.rootDTOObject = this._policy;
        request.parentDTOObject = this.applicant;
        request.workingDTOObject = this.coverage;
        return request;
    }
}
