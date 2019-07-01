import { Component, Injector, Input } from '@angular/core';
import { MasterDetailComponentResolver, MasterButton, MasterButtonType } from 'life-core/component/master-detail';
import { BaseDataManager, RowManagementDelegate } from 'life-core/component/master-detail';

import { BasePolicyMasterDetailViewModel } from 'business/policy/shared';
import { MedicationDTO } from 'ls-core/model';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { RxOtherMedicationItemFactory } from 'business/policy/evidence/rx/rx-other-medication/rx-other-medication-item-factory';
import { OtherDrugMedicationDataDetailComponent } from './detail/other-drug-medication-data-detail.component';
import { OtherMedicationDataDetailColumnsBuilder } from './detail/other-medication-data-detail-grid-columns.builder';

export function otherDrugRowManagementDelegateFactory(
    itemFactory: RxOtherMedicationItemFactory,
    dataManager: BaseDataManager<MedicationDTO>
): any {
    return new RowManagementDelegate({
        itemName: 'OtherDrugs',
        itemIDPropertyName: 'MedicationId',
        itemFactory: itemFactory,
        dataManager: dataManager
    });
}

export function otherDrugItemComponentResolverFactory(): any {
    return new MasterDetailComponentResolver({
        itemComponents: OtherDrugMedicationDataDetailComponent
    });
}

@Component({
    selector: 'other-drug-medication',
    templateUrl: './other-drug-medication-data-list.component.html',
    providers: [
        BaseDataManager,
        RxOtherMedicationItemFactory,
        {
            provide: RowManagementDelegate,
            useFactory: otherDrugRowManagementDelegateFactory,
            deps: [RxOtherMedicationItemFactory, BaseDataManager]
        },
        {
            provide: MasterDetailComponentResolver,
            useFactory: otherDrugItemComponentResolverFactory
        },
        OtherMedicationDataDetailColumnsBuilder
    ]
})
export class OtherDrugMedicationDataListComponent extends BasePolicyMasterDetailViewModel<MedicationDTO> {
    @Input()
    public otherDrugMedicationDTO: MedicationDTO[];
    private _gridColumnsBuilder: IGridColumnsBuilder;

    constructor(injector: Injector, gridColumnsBuilder: OtherMedicationDataDetailColumnsBuilder) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
    }

    public get showDetailAsPopup(): boolean {
        return false;
    }

    public loadData(): Promise<void> {
        return Promise.resolve();
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected get numHeaderRows(): number {
        return 2;
    }

    protected getInlineDetailButtons(): MasterButton<MedicationDTO>[] {
        const customButtons: MasterButton<MedicationDTO>[] = [
            new MasterButton({ type: MasterButtonType.ADD }),
            new MasterButton({ type: MasterButtonType.SAVE }),
            new MasterButton({ type: MasterButtonType.DELETE })
        ];
        return [...customButtons];
    }

    protected loadItems(): MedicationDTO[] {
        return this.otherDrugMedicationDTO;
    }

    protected getRowNodeId(data: MedicationDTO): any {
        return data.MedicationId;
    }
}
