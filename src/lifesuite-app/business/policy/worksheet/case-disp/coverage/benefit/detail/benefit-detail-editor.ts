import { Component, Injector, Injectable } from '@angular/core';
import { BasePolicyDialogDetailViewModel } from 'business/policy/shared/master-detail';
import { ParentChildRegistry } from 'life-core/view-model';
import { AuthorizationProvider } from 'life-core/authorization';
import { ListDataService, ListsDataRequest, ListDataRequestBuilder } from 'ls-core/service';
import { BenefitDTO } from 'ls-core/model';
import { CoverageAuthorizationProvider } from './../../coverage-authorization.provider';

@Component({
    selector: 'benefit-detail-editor',
    templateUrl: './benefit-detail-editor.html',
    providers: [ParentChildRegistry, { provide: AuthorizationProvider, useClass: CoverageAuthorizationProvider }]
})
@Injectable()
export class BenefitDialogDetailEditor extends BasePolicyDialogDetailViewModel<BenefitDTO> {
    private _listDataService: ListDataService;

    constructor(injector: Injector, listDataService: ListDataService) {
        super(injector);
        this._listDataService = listDataService;
    }

    public onCaseDispositionChange(caseDispositionSelection: Event): void {
        this.resetReasonText();
        this.reloadCaseDispositionReasonList(caseDispositionSelection);
    }

    protected resetReasonText(): void {
        if (this.data.ReasonText) {
            this.data.ReasonText = '';
        }
    }

    private reloadCaseDispositionReasonList(caseDispositionSelection: Event): void {
        let request = this.getListsDataRequest();
        this._listDataService.load(request).then(data => {
            this.resolvedData.listData.ReasonText = data.ReasonText;
        });
    }

    protected getListsDataRequest(): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this.data);
        listDataRequestBuilder.addListRequestItem(this.data, 'ReasonText');
        return listDataRequestBuilder.getRequest();
    }
}
