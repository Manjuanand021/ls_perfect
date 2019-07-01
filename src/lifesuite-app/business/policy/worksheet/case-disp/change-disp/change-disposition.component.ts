import { Component, Injector } from '@angular/core';

import { ParentChildRegistry } from 'life-core/view-model';
import { DialogViewModelResult, DialogData } from 'life-core/component/dialog';
import { ICancelableDataManager, CancelableDataManager } from 'life-core/data-management';
import { AuthorizationProvider } from 'life-core/authorization';
import { ListItem } from 'life-core/model/list.model';
import { I18n } from 'life-core/i18n';

import {
    DataServiceParams,
    UIServiceNames,
    UIServiceMethods,
    ListsDataRequest,
    ListDataRequestBuilder
} from 'ls-core/service';
import { PolicyDTO } from 'ls-core/model';
import { AppSession } from 'ls-core/session';
import { DTOObjectUtil } from 'ls-core/util';
import { LsAppConfig, SystemSetting } from 'ls-core/config';

import { BaseChangeDispositionComponent } from 'business/policy/worksheet/case-disp/change-disp/base-change-disposition.component';
import { CoverageStatuses, Prompt } from 'business/policy/shared';
import { CaseAuthorizationProvider } from 'business/policy/shared/authorization';
import { PolicyDataModel } from 'business/policy/shared/data-model';

@Component({
    selector: 'change-disposition',
    templateUrl: './change-disposition.component.html',
    providers: [
        ParentChildRegistry,
        { provide: AuthorizationProvider, useClass: CaseAuthorizationProvider },
        CancelableDataManager
    ]
})
export class ChangeDispositionComponent extends BaseChangeDispositionComponent<PolicyDataModel> {
    public filteredDispositionList: Array<ListItem>;
    public isNoteRequired: boolean;
    public isReasonRequired: boolean;

    private _cancelableDataManager: ICancelableDataManager<PolicyDTO>;
    private _appSession: AppSession;
    private _filteredDispositionArray: Array<any>;
    private _filteredReasonArray: Array<any>;
    private _appConfig: LsAppConfig;

    constructor(
        injector: Injector,
        i18n: I18n,
        appConfig: LsAppConfig,
        cancelableDataManager: CancelableDataManager,
        appSession: AppSession
    ) {
        super(injector, i18n);
        this._cancelableDataManager = cancelableDataManager as CancelableDataManager<PolicyDTO>;
        this._appSession = appSession;
        this._appConfig = appConfig;
    }

    public setModel(model: DialogData): void {
        super.setModel(model);
        this._cancelableDataManager.setItem(model.parameterData as PolicyDTO);
        this.subscriptionTracker.track(
            this._cancelableDataManager.getItem().subscribe(policy => {
                this.data.policy = policy;
                this.onDataSet();
            })
        );
    }

    public setupData(): void {
        this._filteredDispositionArray = this.resolvedData.listData.Disposition;
        this._filteredReasonArray = this.resolvedData.listData.ReasonText;
        this.getFilteredDispositionListItems();
        this.getFilteredReasonTextListItems();
        this.isNoteRequired =
            this._appConfig.getSystemSetting(SystemSetting.WorksheetFANoteRequired).toLowerCase() === 'true';
        this.isReasonRequired =
            this._appConfig.getSystemSetting(SystemSetting.FinalActionReasonRequired).toLowerCase() === 'true';
    }

    protected resetReasonText(): void {
        if (this.data.policy.ReasonText) {
            this.data.policy.ReasonText = '';
        }
    }

    protected getReasonListDataRequest(): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this.data.policy);
        listDataRequestBuilder.addListRequestItem(this.data.policy, 'ReasonText');
        return listDataRequestBuilder.getRequest();
    }

    protected getSetCaseDispositionServiceParams(): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.SET_DISPOSITION_SERVICE,
            serviceMethod: UIServiceMethods.SET_DISPOSITION,
            requestPayload: this.getCaseDispositionServicePayload()
        });
    }

    protected isCancelOpenRequirementOptionAvailable(): boolean {
        return this.data.policy.Disposition != null && this.data.policy.Disposition != CoverageStatuses.PENDING;
    }

    protected setDisposition(): Promise<DialogViewModelResult> {
        const serviceParams: DataServiceParams = this.getSetCaseDispositionServiceParams();
        return this.dataService.getData(serviceParams).then(response => {
            const changeDispositionResponse = response.responsePayload as DispositionResponse;
            if (changeDispositionResponse && changeDispositionResponse.Success) {
                const updatedPolicy: PolicyDTO = DTOObjectUtil.deepConvertObjectOfType(
                    changeDispositionResponse.Policy,
                    PolicyDTO
                ) as PolicyDTO;
                this._appSession.updatePolicy(updatedPolicy);
                return Promise.resolve(new DialogViewModelResult(null, true));
            } else {
                this.showDispositionErrorMessage(changeDispositionResponse.ResultMessage).then(() => {
                    return Promise.resolve(new DialogViewModelResult(null, true));
                });
            }
        });
    }

    private getFilteredDispositionListItems(): Array<ListItem> {
        this.filteredDispositionList = this._filteredDispositionArray.filter(item => {
            return item.Id !== this.data.policy.Disposition;
        });
        return this.filteredDispositionList;
    }

    private getFilteredReasonTextListItems(): Array<ListItem> {
        this.filteredReasonList = this._filteredReasonArray.filter(item => {
            return item.Id !== this.data.policy.PolicyStatusCode;
        });
        return this.filteredReasonList;
    }

    private getCaseDispositionServicePayload(): CaseDispositionRequest {
        const request = new CaseDispositionRequest();
        request.Policy = this.data.policy;
        request.InsuredID = request.Policy.Insureds_LazyLoad[0].PolicyPersonId as number;
        request.CancelOpenRequirements = this.cancelOpenRequirementsValue == 'Exclude';
        request.CancelAllRequirements = this.cancelOpenRequirementsValue == 'All';
        return request;
    }

    protected resetDispositionData(): Promise<DialogViewModelResult> {
        this._cancelableDataManager.cancelItem(this.data.policy);
        return Promise.resolve(new DialogViewModelResult(null, true));
    }
}

export class DispositionRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.DispositionRequest, LifeSuite.UIServiceDTO';

    public Policy: PolicyDTO;
    public InsuredID: number;
    public CancelOpenRequirements: boolean;
    public CancelAllRequirements: boolean;
}

export class CaseDispositionRequest extends DispositionRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.CaseDispositionRequest, LifeSuite.UIServiceDTO';
}

export class DispositionResponse {
    public readonly $type: string = 'life.ls.ui.ria.dto.responses.DispositionResponse, LifeSuite.UIServiceDTO';

    public Policy: PolicyDTO;
    public ResultMessage: string;
    public Success: boolean;
    public Prompts: Prompt[];
    public AprovalPrompts: Prompt[];
}
