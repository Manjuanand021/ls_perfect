import { Component, Injector, Injectable } from '@angular/core';
import { RowManagementDelegate, BaseDataManager } from 'life-core/component/master-detail';
import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { PolicyDTO, AmendmentDTO, CoverageDTO } from 'ls-core/model';
import { AppSession } from 'ls-core/session/app-session';
import { ListDataService, ListDataRequestBuilder, ListDataItem, ListDataUtil } from 'ls-core/service';
import { ObjectUtil } from 'life-core/util/lang';
import { ParentChildRegistry, ViewValidationResult } from 'life-core/view-model';
import { AuthorizationProvider } from 'life-core/authorization';
import { CoverageAuthorizationProvider } from './../../coverage-authorization.provider';
import { ListMap } from 'life-core/model';
import { DialogViewModelResult, DialogButtonType } from 'life-core/component/dialog';
import { AmendmentItemFactory } from 'business/policy/worksheet/case-disp/coverage/amendment/amendment-item-factory';
export function rowManagementDelegateFactory(
    itemFactory: AmendmentItemFactory,
    dataManager: BaseDataManager<AmendmentDTO>
): RowManagementDelegate<AmendmentDTO> {
    return new RowManagementDelegate({
        itemName: 'Issue Request',
        itemIDPropertyName: 'CoveragePersonAmendmentId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}
@Component({
    selector: 'amendment-detail-editor',
    templateUrl: './amendment-detail-editor.html',
    providers: [
        ParentChildRegistry,
        BaseDataManager,
        AmendmentItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [AmendmentItemFactory, BaseDataManager]
        },
        { provide: AuthorizationProvider, useClass: CoverageAuthorizationProvider }
    ]
})
@Injectable()
export class AmendmentDialogDetailEditor extends BasePolicyDialogDetailViewModel<AmendmentDTO> {
    public amendmentCodeOptions: ListMap<ListDataItem> = {};
    public context: CoverageDTO;
    public isDisabledOnEdit: boolean;

    private _policy: PolicyDTO;
    private _selectedAmendmentTypeValue: string;
    private _listDataService: ListDataService;
    private _amendmentArray: ListDataItem[];

    constructor(injector: Injector, appSession: AppSession, listDataService: ListDataService) {
        super(injector);
        this._policy = appSession.policyDTO;
        this._listDataService = listDataService;
        this._amendmentArray = new Array<ListDataItem>();
        this.isDisabledOnEdit = false;
    }

    public loadData(): Promise<void> {
        if (this.data.AmendmentCode) {
            this.isDisabledOnEdit = true;
            this.loadAmendmentCodeListData();
        }
        return Promise.resolve();
    }

    public getListsDataRequest(): any {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this._policy);
        const amendmentDTO = ObjectUtil.createObjectOfType(this.data, AmendmentDTO);
        listDataRequestBuilder.addListRequestItem(amendmentDTO, 'AmendmentCode');
        return listDataRequestBuilder.getRequest();
    }

    public onAmendmentTypeChange(selectedAmendmentType: any): void {
        this._selectedAmendmentTypeValue = selectedAmendmentType.value;
        this.data.AmendmentType = this._selectedAmendmentTypeValue;
        this.data.AmendmentText = '';
        this.data.AmendmentCode = '';
        this.loadAmendmentCodeListData();
    }

    public onAmendmentCodeChange(selectedAmendmentCode: any): void {
        this.data.AmendmentText = ListDataUtil.getExternalCodeFromListDataById(
            this._amendmentArray,
            selectedAmendmentCode.value
        );
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.ACCEPT_ADD || this.isDialogButtonTypeOK(buttonId)) {
            const isDirty = this.isDirty();
            const amendment = { ...this.data };
            return this.validate().then(result => {
                if (result === ViewValidationResult.pass) {
                    this.resetAmendmentDialogData(buttonId, amendment.CoveragePersonId);
                    return new DialogViewModelResult(amendment, this.isDialogButtonTypeOK(buttonId), isDirty);
                } else {
                    return new DialogViewModelResult(null, false);
                }
            });
        } else {
            return Promise.resolve(null);
        }
    }

    protected loadAmendmentCodeListData(): any {
        const request = this.getListsDataRequest();
        this._listDataService.load(request).then(data => {
            Object.assign(this.amendmentCodeOptions, data);
            this._amendmentArray = data.AmendmentCode;
        });
    }

    private resetAmendmentDialogData(buttonId: string, coveragePersonId: object): void {
        if (buttonId == DialogButtonType.ACCEPT_ADD) {
            this.data = new AmendmentDTO();
            this.data.CoveragePersonId = coveragePersonId;
            this.form.reset();
        }
    }
}
