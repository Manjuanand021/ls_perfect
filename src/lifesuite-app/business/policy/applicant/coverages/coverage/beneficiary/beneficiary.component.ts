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

import { BeneficiaryDTO, PolicyDTO, CoverageDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';
import { BeneficiaryItemFactory } from './beneficiary-item-factory';
import { BasePolicyMasterDetailViewModel } from 'business/policy/shared';
import { BeneficiaryDialogDetailEditor } from './detail/beneficiary-detail-editor';
import { ResolvedDataNames } from 'life-core/view-model';
import { BeneficiaryGridColumnsBuilder } from './beneficiary-grid-column.builder';
import { BeneficiaryDialogDataResolver } from './detail';
import { BeneficiaryDialogMetaDataResolver } from './detail/beneficiary-dialog-metadata.resolver';

export function rowManagementDelegateFactory(
    itemFactory: BeneficiaryItemFactory,
    dataManager: BaseDataManager<BeneficiaryDTO>
): RowManagementDelegate<BeneficiaryDTO> {
    return new RowManagementDelegate({
        itemName: 'Beneficiary',
        itemIDPropertyName: 'CoveragePersonId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<BeneficiaryDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: BeneficiaryDialogDetailEditor
    });
}

@Component({
    selector: 'beneficiary',
    templateUrl: './beneficiary.component.html',
    providers: [
        PolicySubscriber,
        BaseDataManager,
        BeneficiaryItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [BeneficiaryItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        BeneficiaryGridColumnsBuilder
    ]
})
export class BeneficiaryComponent extends BasePolicyMasterDetailViewModel<BeneficiaryDTO> {
    @Input()
    public coverage: CoverageDTO;
    private _policy: PolicyDTO;

    private _gridColumnsBuilder: BeneficiaryGridColumnsBuilder;

    constructor(
        injector: Injector,
        gridColumnsBuilder: BeneficiaryGridColumnsBuilder,
        policySubscriber: PolicySubscriber,
        i18n: I18n
    ) {
        super(injector);
        this.i18n = i18n;
        this._gridColumnsBuilder = gridColumnsBuilder;
        policySubscriber.subscribe(this, policy => {
            this._policy = policy;
        });
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

    protected loadItems(): BeneficiaryDTO[] {
        return this.coverage.Beneficiaries_LazyLoad;
    }

    protected getRowNodeId(data: BeneficiaryDTO): Object {
        return data.CoveragePersonId;
    }

    protected getItemDetailDialogResolve(item: BeneficiaryDTO): DirectDataResolve[] {
        const context = { coverage: this.coverage, beneficiary: item };
        return [
            { resolveName: ResolvedDataNames.listData, resolverClass: BeneficiaryDialogDataResolver, context: context },
            { resolveName: ResolvedDataNames.metaData, resolverClass: BeneficiaryDialogMetaDataResolver, context: item }
        ];
    }

    protected getItemDetailDialogSize(): DialogSize {
        return DialogSize.large;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Beneficiary', id: 'policy.case.beneficiary.title' });
    }

    protected getPopupDetailButtons(): MasterButton<BeneficiaryDTO>[] {
        return [
            new MasterButton({ type: MasterButtonType.ADD }),
            new MasterButton({ type: MasterButtonType.EDIT }),
            new MasterButton({ type: MasterButtonType.DELETE })
        ];
    }
}
