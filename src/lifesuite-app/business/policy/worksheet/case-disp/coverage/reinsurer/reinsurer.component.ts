import { Component, Injector, Injectable, Input } from '@angular/core';

import { RowManagementDelegate, MasterDetailComponentResolver, BaseDataManager } from 'life-core/component/master-detail';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { DirectDataResolve } from 'life-core/component/shared';
import { ResolvedDataNames } from 'life-core/view-model/data-resolver';
import { CoverageDTO, ReinsurerDTO } from 'ls-core/model';
import { BasePolicyMasterDetailViewModel } from 'business/policy/shared';
import { LsInsuredAuthorizationProvider } from 'business/policy/worksheet/case-disp/insured/insured-authorization.provider';
import { ReinsurerGridColumnsBuilder } from './reinsurer-grid-columns.builder';
import { ReinsurerItemFactory } from './reinsurer-item-factory';
import { ReinsurerDialogDataResolver } from './detail/reinsurer-dialog-data.resolver';
import { ReinsurerDialogDetailEditor } from './detail/reinsurer-detail-editor';
import { ReinsurerDialogMetaDataResolver } from './detail/reinsurer-dialog-metadata.resolver';
import { AuthorizationProvider } from 'life-core/authorization';
import { I18n } from 'life-core/i18n';

export function rowManagementDelegateFactory(
    itemFactory: ReinsurerItemFactory,
    dataManager: BaseDataManager<ReinsurerDTO>
): RowManagementDelegate<ReinsurerDTO> {
    return new RowManagementDelegate({
        itemName: 'Reinsurer',
        itemIDPropertyName: 'CoveragePersonReinsurerId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<ReinsurerDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: ReinsurerDialogDetailEditor
    });
}

@Component({
    selector: 'reinsurer',
    templateUrl: './reinsurer.component.html',
    providers: [
        BaseDataManager,
        ReinsurerItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [ReinsurerItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        { provide: AuthorizationProvider, useClass: LsInsuredAuthorizationProvider },

        ReinsurerGridColumnsBuilder
    ]
})
@Injectable()
export class ReinsurerComponent extends BasePolicyMasterDetailViewModel<ReinsurerDTO> {
    @Input()
    public coverage: CoverageDTO;

    private _gridColumnsBuilder: ReinsurerGridColumnsBuilder;

    constructor(injector: Injector, gridColumnBuilder: ReinsurerGridColumnsBuilder, i18n: I18n) {
        super(injector);
        this.i18n = i18n;
        this._gridColumnsBuilder = gridColumnBuilder;
        this.i18n = i18n;
    }

    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        this.setResolvedListData();
        return Promise.resolve();
    }

    public get showDetailAsPopup(): boolean {
        return true;
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Reinsurer', id: 'policy.worksheet.coverage.reinsurerheader' });
    }

    protected loadItems(): ReinsurerDTO[] {
        return this.coverage.Reinsurers_LazyLoad;
    }

    protected getRowNodeId(data: ReinsurerDTO): any {
        return data.CoveragePersonReinsurerId;
    }

    protected getItemDetailDialogResolve(item: ReinsurerDTO): DirectDataResolve[] {
        const context = { coverage: this.coverage, reinsurer: item };
        return [
            { resolveName: ResolvedDataNames.listData, resolverClass: ReinsurerDialogDataResolver, context: context },
            { resolveName: ResolvedDataNames.metaData, resolverClass: ReinsurerDialogMetaDataResolver, context: item }
        ];
    }
}
