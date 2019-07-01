import { Injector, Component, Input } from '@angular/core';

import { IGridColumnsBuilder } from 'life-core/component/grid';
import {
    BaseDataManager,
    RowManagementDelegate,
    MasterDetailComponentResolver,
    CreateItemEventData
} from 'life-core/component/master-detail';
import { I18n } from 'life-core/i18n';

import { BenefitDTO, BenefitPartyDTO } from 'ls-core/model';

import { BasePolicyMasterDetailViewModel } from 'business/policy/shared';
import { BenefitPartyItemFactory, BenefitPartyCreateItemParams } from './benefit-party-item.factory';
import { BenefitPartyGridColumnsBuilder } from './benefit-party-grid-columns.builder';
import { BenefitPartyDetailEditor } from './detail/benefit-party-detail-editor';
import { DirectDataResolve, DialogSize } from 'life-core/component';

import { BenefitPartyListDataResolver } from './detail/benefit-party-listdata.resolver';

export function rowManagementDelegateFactory(
    itemFactory: BenefitPartyItemFactory,
    dataManager: BaseDataManager<BenefitPartyDTO>
): RowManagementDelegate<BenefitPartyDTO> {
    return new RowManagementDelegate({
        itemName: 'BenefitParty',
        itemIDPropertyName: 'PartyId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function itemComponentResolverFactory(): MasterDetailComponentResolver<BenefitPartyDTO> {
    return new MasterDetailComponentResolver({
        itemComponents: BenefitPartyDetailEditor
    });
}

@Component({
    selector: 'benefit-party',
    templateUrl: './benefit-party.component.html',
    providers: [
        BaseDataManager,
        BenefitPartyItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: rowManagementDelegateFactory,
            deps: [BenefitPartyItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: itemComponentResolverFactory
        },
        BenefitPartyGridColumnsBuilder
    ]
})
export class BenefitPartyComponent extends BasePolicyMasterDetailViewModel<BenefitPartyDTO> {
    @Input() public benefit: BenefitDTO;
    private _gridColumnsBuilder: BenefitPartyGridColumnsBuilder;

    constructor(injector: Injector, benefitPartyGridColumnsBuilder: BenefitPartyGridColumnsBuilder, i18n: I18n) {
        super(injector);
        this.i18n = i18n;
        this._gridColumnsBuilder = benefitPartyGridColumnsBuilder;
    }

    public loadData(): Promise<void> {
        this.setResolvedListData();
        return Promise.resolve(null);
    }

    public get showDetailAsPopup(): boolean {
        return true;
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getTitle(): string {
        return this.i18n({ value: 'Benefit Party', id: 'policy.case.benefitparty.title' });
    }

    protected loadItems(): BenefitPartyDTO[] {
        return this.benefit.BenefitParties_LazyLoad;
    }

    protected getRowNodeId(data: BenefitPartyDTO): any {
        return data.PartyId;
    }
    protected createItem(eventData: CreateItemEventData): Promise<BenefitPartyDTO> {
        const newBenefitParty = this.rowManagementDelegate.addNewRow({
            items: this.items,
            benefit: this.benefit
        } as BenefitPartyCreateItemParams<BenefitPartyDTO>);
        return Promise.resolve(newBenefitParty);
    }

    protected getItemDetailDialogResolve(item: BenefitPartyDTO): DirectDataResolve[] {
        return [
            {
                resolveName: 'listData',
                resolverClass: BenefitPartyListDataResolver,
                context: item
            }
        ];
    }

    protected getItemDetailDialogSize(): DialogSize | string {
        return 'lg';
    }
}
