import { Component, Injector, Injectable, Input } from '@angular/core';

import { RowManagementDelegate, MasterDetailComponentResolver, BaseDataManager } from 'life-core/component/master-detail';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { DirectDataResolve } from 'life-core/component/shared';
import { AuthorizationProvider } from 'life-core/authorization';
import { I18n } from 'life-core/i18n';

import { CoverageDTO, ImpairmentRestrictionDTO } from 'ls-core/model';
import { BasePolicyMasterDetailViewModel } from 'business/policy/shared';
import { LsInsuredAuthorizationProvider } from 'business/policy/worksheet/case-disp/insured/insured-authorization.provider';
import { ImpairmentGridColumnsBuilder } from './impairment-grid-columns.builder';
import { ImpairmentItemFactory } from './impairment-item-factory';
import { ImpairmentDialogDataResolver } from './detail/impairment-dialog-data.resolver';
import { ImpairmentDialogDetailEditor } from './detail/impairment-detail-editor';

export function rowManagementDelegateFactory(
    itemFactory: ImpairmentItemFactory,
    dataManager: BaseDataManager<ImpairmentRestrictionDTO>
): RowManagementDelegate<ImpairmentRestrictionDTO> {
    return new RowManagementDelegate({
        itemName: 'Impairment',
        itemIDPropertyName: 'CoveragePersonImpairmentId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<ImpairmentRestrictionDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: ImpairmentDialogDetailEditor
    });
}

@Component({
    selector: 'impairment',
    templateUrl: './impairment.component.html',
    providers: [
        BaseDataManager,
        ImpairmentItemFactory,
        ImpairmentGridColumnsBuilder,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [ImpairmentItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        { provide: AuthorizationProvider, useClass: LsInsuredAuthorizationProvider }
    ]
})
@Injectable()
export class ImpairmentComponent extends BasePolicyMasterDetailViewModel<ImpairmentRestrictionDTO> {
    @Input()
    public coverage: CoverageDTO;
    private _gridColumnBuilder: ImpairmentGridColumnsBuilder;

    constructor(injector: Injector, gridColumnBuilder: ImpairmentGridColumnsBuilder, i18n: I18n) {
        super(injector);
        this._gridColumnBuilder = gridColumnBuilder;
        this.i18n = i18n;
    }

    public get showDetailAsPopup(): boolean {
        return true;
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnBuilder;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Impairment', id: 'policy.worksheet.coverage.impairmentheader' });
    }

    protected loadItems(): ImpairmentRestrictionDTO[] {
        return this.coverage.ImpairmentRestrictions_LazyLoad;
    }

    protected getRowNodeId(data: ImpairmentRestrictionDTO): any {
        return data.CoveragePersonImpairmentId;
    }

    protected getItemDetailDialogResolve(item: ImpairmentRestrictionDTO): DirectDataResolve[] {
        return [{ resolveName: 'listData', resolverClass: ImpairmentDialogDataResolver, context: item }];
    }
}
