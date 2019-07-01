import { Component, Injector, Input } from '@angular/core';

import {
    RowManagementDelegate,
    MasterDetailComponentResolver,
    BaseDataManager,
    MasterButton,
    MasterButtonType
} from 'life-core/component/master-detail';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { DirectDataResolve } from 'life-core/component/shared';
import { DialogSize } from 'life-core/component';
import { I18n } from 'life-core/i18n';

import { FundAllocationDTO, CoverageDTO } from 'ls-core/model';

import { BasePolicyMasterDetailViewModel } from 'business/policy/shared';
import { FundsListGridColumnsBuilder } from './funds-list-grid-columns.builder';
import { FundAllocationItemFactory } from './funds-list-item-factory';
import { FundsListDialogDataResolver } from './detail/funds-list-dialog-data.resolver';
import { FundsListDialogDetailEditor } from './detail/funds-list-detail-editor';

export function rowManagementDelegateFactory(
    itemFactory: FundAllocationItemFactory,
    dataManager: BaseDataManager<FundAllocationDTO>
): any {
    return new RowManagementDelegate({
        itemName: 'Funds',
        itemIDPropertyName: 'FundAllocationId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): any {
    return new MasterDetailComponentResolver({
        itemComponents: FundsListDialogDetailEditor
    });
}

@Component({
    selector: 'funds-list',
    templateUrl: './funds-list.component.html',
    providers: [
        BaseDataManager,
        FundAllocationItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [FundAllocationItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        FundsListGridColumnsBuilder
    ]
})
export class FundsListComponent extends BasePolicyMasterDetailViewModel<FundAllocationDTO> {
    @Input()
    public coverage: CoverageDTO;

    private _gridColumnsBuilder: FundsListGridColumnsBuilder;

    constructor(injector: Injector, gridColumnsBuilder: FundsListGridColumnsBuilder, i18n: I18n) {
        super(injector);
        this.i18n = i18n;
        this._gridColumnsBuilder = gridColumnsBuilder;
    }

    public loadData(): Promise<void> {
        this.setResolvedListData();
        this.setResolvedMetaData();
        return Promise.resolve();
    }

    public get showDetailAsPopup(): boolean {
        return true;
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected loadItems(): FundAllocationDTO[] {
        return this.coverage.FundAllocations_LazyLoad;
    }

    protected getRowNodeId(data: FundAllocationDTO): any {
        return data.FundAllocationId;
    }

    protected getItemDetailDialogResolve(item: FundAllocationDTO): DirectDataResolve[] {
        return [
            {
                resolveName: 'listData',
                resolverClass: FundsListDialogDataResolver,
                context: {
                    activeFund: item,
                    fundList: this.coverage.FundAllocations_LazyLoad,
                    fundCodes: this.listData.FundCode
                }
            }
        ];
    }

    protected getPopupDetailButtons(): MasterButton<FundAllocationDTO>[] {
        return [
            new MasterButton({ type: MasterButtonType.ADD }),
            new MasterButton({ type: MasterButtonType.EDIT }),
            new MasterButton({ type: MasterButtonType.DELETE })
        ];
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Funds', id: 'policy.case.funds.title' });
    }
    protected getItemDetailDialogSize(): DialogSize | string {
        return DialogSize.large;
    }
}
