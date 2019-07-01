import { Component, Injector } from '@angular/core';

import { ParentChildRegistry } from 'life-core/view-model';
import { DialogViewModelResult } from 'life-core/component/dialog';
import { ICancelableDataManager, CancelableDataManager } from 'life-core/data-management';
import { I18n } from 'life-core/i18n';
import { ListItem } from 'life-core/model/list.model';
import { AuthorizationProvider } from 'life-core/authorization';
import { DialogButton, DialogButtonType, DialogSize, ModalDialog, DialogData } from 'life-core/component/dialog';

import { CoverageDTO, PolicyDTO } from 'ls-core/model';
import {
    DataServiceParams,
    UIServiceNames,
    UIServiceMethods,
    ListsDataRequest,
    ListDataRequestBuilder,
    DataService
} from 'ls-core/service';
import { AppSession } from 'ls-core/session';
import { DTOObjectUtil } from 'ls-core/util';
import { LsAppConfig, SystemSetting } from 'ls-core/config';

import {
    CaseDispositionRequest,
    DispositionResponse,
    BaseChangeDispositionComponent
} from 'business/policy/worksheet/case-disp/change-disp';
import { CoverageStatuses, Prompt } from 'business/policy/shared';
import { CoverageValidationComponent } from 'business/policy/worksheet/case-disp/coverage/change-coverage-disp/coverage-validation/coverage-validation.component';
import { CoverageAuthorizationProvider } from 'business/policy/worksheet/case-disp/coverage/coverage-authorization.provider';

@Component({
    selector: 'change-coverage-disposition',
    templateUrl: './change-coverage-disposition.component.html',
    providers: [
        ParentChildRegistry,
        { provide: AuthorizationProvider, useClass: CoverageAuthorizationProvider },
        CancelableDataManager
    ]
})
export class ChangeCoverageDispositionComponent extends BaseChangeDispositionComponent<CoverageDTO> {
    public filteredDispositionList: Array<ListItem>;
    public filteredReasonList: Array<ListItem>;
    public isReasonRequired: boolean;
    public isNoteRequired: boolean;
    public applyToAllBenefits: boolean;

    private _cancelableDataManager: ICancelableDataManager<CoverageDTO>;
    private _policy: PolicyDTO;
    private _dataService: DataService;
    private _appSession: AppSession;
    private _modalDialog: ModalDialog;
    private _validationMessages: Prompt[];
    private _filteredDispositionArray: Array<any>;
    private _filteredReasonArray: Array<any>;
    private _appConfig: LsAppConfig;

    constructor(
        injector: Injector,
        i18n: I18n,
        appConfig: LsAppConfig,
        cancelableDataManager: CancelableDataManager,
        appSession: AppSession,
        dataService: DataService,
        modalDialog: ModalDialog
    ) {
        super(injector, i18n);
        this._cancelableDataManager = cancelableDataManager as CancelableDataManager<CoverageDTO>;
        this._appSession = appSession;
        this._dataService = dataService;
        this._modalDialog = modalDialog;
        this._policy = this._appSession.policyDTO;
        this._appConfig = appConfig;
        this.applyToAllBenefits = false;
    }

    public setModel(model: DialogData): void {
        super.setModel(model);
        this._cancelableDataManager.setItem(model.parameterData as CoverageDTO);
        this.subscriptionTracker.track(
            this._cancelableDataManager.getItem().subscribe(coverage => {
                this.data = coverage;
                this.onDataSet();
            })
        );
    }

    protected setupData(): void {
        this._validationMessages = [];
        this._filteredDispositionArray = this.resolvedData.listData.CoverageStatus;
        this._filteredReasonArray = this.resolvedData.listData.ReasonText;
        this.isReasonRequired =
            this._appConfig.getSystemSetting(SystemSetting.FinalActionReasonRequired).toLowerCase() === 'true';
        this.isNoteRequired =
            this._appConfig.getSystemSetting(SystemSetting.WorksheetFANoteRequired).toLowerCase() === 'true';
        this.getFilteredDispositionListItems();
        this.getFilteredReasonTextListItems();
    }

    protected isCancelOpenRequirementOptionAvailable(): boolean {
        return (
            this.data.Disposition != null &&
            this.data.Disposition != CoverageStatuses.PENDING &&
            this.data.Disposition != CoverageStatuses.APPROVED
        );
    }

    protected getReasonListDataRequest(): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this._policy);
        listDataRequestBuilder.addListRequestItem(this.data, 'ReasonText');

        return listDataRequestBuilder.getRequest();
    }

    protected setDisposition(): Promise<DialogViewModelResult> {
        const serviceParams: DataServiceParams = this.getSetCoverageDispositionServiceParams();
        return this._dataService.getData(serviceParams).then(response => {
            const dispositionResponse = response.responsePayload as DispositionResponse;
            if (dispositionResponse && dispositionResponse.Success) {
                this.updatePolicyInSession(dispositionResponse.Policy);
                return new DialogViewModelResult(null, true);
            }
            return this.handleCoverageDispositionValidation(dispositionResponse);
        });
    }

    protected getSetCoverageDispositionServiceParams(): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.SET_DISPOSITION_SERVICE,
            serviceMethod: UIServiceMethods.SET_DISPOSITION,
            requestPayload: this.getSetCoverageDispositionServicePayload()
        });
    }

    protected resetDispositionData(): Promise<DialogViewModelResult> {
        this._cancelableDataManager.cancelItem(this.data);
        return Promise.resolve(new DialogViewModelResult(null, true));
    }

    protected resetReasonText(): void {
        if (this.data.ReasonText) {
            this.data.ReasonText = '';
        }
    }

    private getFilteredDispositionListItems(): Array<ListItem> {
        this.filteredDispositionList = this._filteredDispositionArray.filter(item => {
            return item.Id !== this.data.CoverageStatus;
        });
        return this.filteredDispositionList;
    }

    private getFilteredReasonTextListItems(): Array<ListItem> {
        this.filteredReasonList = this._filteredReasonArray.filter(item => {
            return item.Id !== this.data.CoverageStatusDescription;
        });
        return this.filteredReasonList;
    }

    private getSetCoverageDispositionServicePayload(): CoverageDispositionRequest {
        const request = new CoverageDispositionRequest();
        request.Policy = this._policy;
        request.CoverageDTO = this.data;
        request.ApplyToAllBenefits = this.applyToAllBenefits;
        request.CancelOpenRequirements = this.cancelOpenRequirementsValue == 'Exclude';
        request.CancelAllRequirements = this.cancelOpenRequirementsValue == 'All';
        request.AprovalPrompts = this._validationMessages;
        return request;
    }

    private updatePolicyInSession(updatedPolicy: PolicyDTO): void {
        const policyDTO: PolicyDTO = DTOObjectUtil.deepConvertObjectOfType(updatedPolicy, PolicyDTO) as PolicyDTO;
        this._appSession.updatePolicy(policyDTO);
    }

    private handleCoverageDispositionValidation(
        dispositionResponse: DispositionResponse
    ): Promise<DialogViewModelResult> {
        if (dispositionResponse && dispositionResponse.AprovalPrompts) {
            this._validationMessages = dispositionResponse.AprovalPrompts;
            return this.showValidationMessages();
        }
        if (dispositionResponse && dispositionResponse.ResultMessage) {
            return this.showDispositionErrorMessage(dispositionResponse.ResultMessage).then(() => {
                return Promise.resolve(new DialogViewModelResult(null, true));
            });
        }
    }

    private showValidationMessages(): Promise<DialogViewModelResult> {
        return this._modalDialog
            .open({
                view: CoverageValidationComponent,
                title: this.i18n({ value: 'Coverage Validation', id: 'policy.worksheet.coverageValidationTitle' }),
                buttons: [
                    new DialogButton({ type: DialogButtonType.CONTINUE }),
                    new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
                ],
                data: this._validationMessages,
                size: DialogSize.large
            })
            .then(dialogRef => {
                return dialogRef.result.then(result =>
                    result.buttonId == DialogButtonType.CONTINUE ? this.onValidationCompleted() : null
                );
            });
    }

    private onValidationCompleted(): Promise<DialogViewModelResult> {
        this._validationMessages.forEach(message => {
            message.Deleted = true;
        });
        return this.setDisposition();
    }
}

class CoverageDispositionRequest extends CaseDispositionRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.CoverageDispositionRequest, LifeSuite.UIServiceDTO';

    public CoverageDTO: CoverageDTO;
    public Overriden: boolean;
    public ApplyToAllBenefits: boolean;
    public PromptResponses: any[];
    public AprovalPrompts: any[];
}
