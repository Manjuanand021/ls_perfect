import { Component, Injector } from '@angular/core';

import { PolicySubscriber } from 'ls-core/session';
import {
    MasterButton,
    BaseDataManager,
    RowManagementDelegate,
    MasterDetailComponentResolver
} from 'life-core/component/master-detail';
import {
    IDataGridOptions,
    IGridColumnsBuilder,
    DataGridColumns,
    DataGridOptionsUtil,
    DataGridCommonOptions
} from 'life-core/component/grid';

import { PolicyDTO, MIBDTO } from 'ls-core/model';
import { BasePolicyMasterDetailViewModel, ApplicantListHelper } from 'business/policy/shared';
import { MIBReportDetailItemFactory } from './mib-report-detail-item-factory';
import { MIBReportDetailGridColumnsBuilder } from './mib-report-detail-grid-columns.builder';
import { MIBReportItemDetailComponent } from './item-detail';
import { MIBMasterGridNodeIds, MIBItemNames } from '../../mib.resources';

export function mibReportRowManagementDelegateFactory(
    itemFactory: MIBReportDetailItemFactory,
    dataManager: BaseDataManager<MIBDTO>
): RowManagementDelegate<MIBDTO> {
    return new RowManagementDelegate({
        itemName: MIBItemNames.MIBReport,
        itemIDPropertyName: MIBMasterGridNodeIds.MibHeaderId,
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function mibReportItemComponentResolverFactory(): MasterDetailComponentResolver<MIBDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: MIBReportItemDetailComponent
    });
}

@Component({
    selector: 'mib-report-detail',
    templateUrl: './mib-report-detail.component.html',
    providers: [
        BaseDataManager,
        PolicySubscriber,
        MIBReportDetailItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: mibReportRowManagementDelegateFactory,
            deps: [MIBReportDetailItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: mibReportItemComponentResolverFactory
        },
        MIBReportDetailGridColumnsBuilder
    ]
})
export class MIBReportDetailComponent extends BasePolicyMasterDetailViewModel<MIBDTO> {
    public policy: PolicyDTO;
    private _gridColumnsBuilder: IGridColumnsBuilder;
    private _applicantListHelper: ApplicantListHelper;

    constructor(
        injector: Injector,
        policySubscriber: PolicySubscriber,
        gridColumnsBuilder: MIBReportDetailGridColumnsBuilder,
        applicantListHelper: ApplicantListHelper
    ) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.policy = p;
        });
        this._gridColumnsBuilder = gridColumnsBuilder;
        this._applicantListHelper = applicantListHelper;
    }

    public get showDetailAsPopup(): boolean {
        return false;
    }

    protected getInlineDetailButtons(): MasterButton<MIBDTO>[] {
        return [];
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getRowNodeId(data: MIBDTO): any {
        return data.MibHeaderId;
    }

    protected getRemoveItemMessage(item: MIBDTO): string {
        // need not return any message from the method
        // had to implement the method since it is an abstract in base class
        return '';
    }

    protected loadItems(): MIBDTO[] {
        const activeInsured = this._applicantListHelper.getActiveApplicantOrDefault(this.policy.Insureds_LazyLoad);
        return activeInsured.MIBs_LazyLoad;
    }
}
