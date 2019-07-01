import { Component, Injector, Input } from '@angular/core';
import { IGridColumnsBuilder, DataGridRowNumber } from 'life-core/component/grid';
import { MedicationDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';
import { BasePolicyGridViewModel } from 'business/policy/shared';
import { OtherMedicationDataListColumnsBuilder } from './other-medication-data-list-grid-columns.builder';

@Component({
    selector: 'add-other-medication',
    templateUrl: 'other-medication-data-list.component.html',
    providers: [PolicySubscriber, OtherMedicationDataListColumnsBuilder]
})
export class OtherMedicationDataListComponent extends BasePolicyGridViewModel<MedicationDTO> {
    private _gridColumnsBuilder: OtherMedicationDataListColumnsBuilder;
    private _medicationDTO: MedicationDTO[];

    constructor(injector: Injector, gridColumnsBuilder: OtherMedicationDataListColumnsBuilder) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
    }

    @Input()
    public set medicationDTO(value: MedicationDTO[]) {
        this._medicationDTO = value;
        this.refreshGrid();
    }

    public get selectedMedication(): any[] {
        return this.gridOptions.api.getSelectedRows();
    }

    protected loadItems(): MedicationDTO[] {
        return this._medicationDTO || [];
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getRowNodeId(data: MedicationDTO): any {
        return data.DrugName;
    }

    protected setGridTitle(): string {
        return '';
    }

    protected showCheckboxColumn(): boolean {
        return true;
    }

    protected getGridMinRows(): number {
        return DataGridRowNumber.Medium;
    }
}
