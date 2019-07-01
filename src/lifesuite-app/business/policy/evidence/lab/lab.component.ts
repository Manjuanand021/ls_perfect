import { Component, Injector } from '@angular/core';

import { PolicySubscriber } from 'ls-core/session';
import {
    MasterButton,
    BaseDataManager,
    RowManagementDelegate,
    MasterDetailComponentResolver
} from 'life-core/component/master-detail';
import {
    IGridColumnsBuilder,
    IDataGridOptions,
    DataGridColumns,
    DataGridOptionsUtil,
    DataGridCommonOptions
} from 'life-core/component/grid';
import { AuthorizationProvider } from 'life-core/authorization';

import { PolicyDTO, LabDTO } from 'ls-core/model';
import { BasePolicyMasterDetailViewModel, ApplicantListHelper } from 'business/policy/shared';
import { LabItemFactory } from './lab-item-factory';
import { LabGridColumnsBuilder } from './lab-grid-columns.builder';
import { LabDetailComponent } from './detail';
import { LabAuthorizationProvider } from './lab-authorization.provider';

export function labRowManagementDelegateFactory(
    itemFactory: LabItemFactory,
    dataManager: BaseDataManager<LabDTO>
): RowManagementDelegate<LabDTO> {
    return new RowManagementDelegate({
        itemName: 'Lab',
        itemIDPropertyName: 'RequirementInformationId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function labItemComponentResolverFactory(): MasterDetailComponentResolver<LabDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: LabDetailComponent
    });
}

@Component({
    selector: 'lab',
    templateUrl: './lab.component.html',
    providers: [
        BaseDataManager,
        PolicySubscriber,
        LabItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: labRowManagementDelegateFactory,
            deps: [LabItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: labItemComponentResolverFactory
        },
        LabGridColumnsBuilder,
        { provide: AuthorizationProvider, useClass: LabAuthorizationProvider }
    ]
})
export class LabComponent extends BasePolicyMasterDetailViewModel<LabDTO> {
    public policy: PolicyDTO;

    private _gridColumnsBuilder: IGridColumnsBuilder;

    private _applicantListHelper: ApplicantListHelper;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        gridColumnBuilder: LabGridColumnsBuilder,
        applicantListHelper: ApplicantListHelper
    ) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.policy = p;
        });
        this._gridColumnsBuilder = gridColumnBuilder;
        this._applicantListHelper = applicantListHelper;
    }

    public get showDetailAsPopup(): boolean {
        return false;
    }

    protected getInlineDetailButtons(): MasterButton<LabDTO>[] {
        return [];
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getRowNodeId(data: LabDTO): any {
        return data.RequirementInformationId;
    }

    protected getRemoveItemMessage(): string {
        // need not return any message from the method
        // had to implement the method since it is an abstract in base class
        return '';
    }

    protected loadItems(): LabDTO[] {
        const activeInsured = this._applicantListHelper.getActiveApplicantOrDefault(this.policy.Insureds_LazyLoad);
        return activeInsured.Labs_LazyLoad;
    }
}
