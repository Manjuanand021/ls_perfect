import { Component, Injector, Input } from '@angular/core';

import { IGridColumnsBuilder, DataGridRowNumber } from 'life-core/component/grid';
import { AuthorizationProvider } from 'life-core/authorization';

import { MedicalConditionDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';
import { BasePolicyGridViewModel } from 'business/policy/shared';
import { MedicationConditionDataListColumnsBuilder } from './medication-condition-data-list-grid-columns.builder';
import { MedicalConditionPopupAuthorizationProvider } from './../medical-condition-popup-authorization.provider';

@Component({
    selector: 'add-medical-condition',
    templateUrl: 'medical-condition-data-list.component.html',
    providers: [
        PolicySubscriber,
        MedicationConditionDataListColumnsBuilder,
        { provide: AuthorizationProvider, useClass: MedicalConditionPopupAuthorizationProvider }
    ]
})
export class MedicalConditionDataListComponent extends BasePolicyGridViewModel<MedicalConditionDTO> {
    public rowCount: number;
    private _gridColumnsBuilder: MedicationConditionDataListColumnsBuilder;
    private _medicalConditionList: MedicalConditionDTO[];

    constructor(injector: Injector, gridColumnsBuilder: MedicationConditionDataListColumnsBuilder) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
    }

    @Input()
    public set medicalConditionList(value: MedicalConditionDTO[]) {
        this._medicalConditionList = value;
        this.rowCount = value ? value.length : 0;
        this.refreshGrid();
    }

    public get selectedMedicalCondition(): MedicalConditionDTO[] {
        return this.gridOptions.api.getSelectedRows();
    }

    protected loadItems(): MedicalConditionDTO[] {
        return this._medicalConditionList || [];
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getRowNodeId(data: MedicalConditionDTO): any {
        return data.MedicalConditionId;
    }

    protected setGridTitle(): string {
        return '';
    }

    protected getGridMinRows(): number {
        return DataGridRowNumber.Medium;
    }
}
