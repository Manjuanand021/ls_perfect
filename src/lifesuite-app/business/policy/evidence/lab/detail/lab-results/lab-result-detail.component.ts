import { Component, Injector, Input } from '@angular/core';
import { CustomerLabReportProxyModel } from 'ls-core/model';
import { BasePolicyGridViewModel } from 'business/policy/shared/grid/base-policy-grid.vm.ts';
import { IGridColumnsBuilder, DataGridRowNumber } from 'life-core/component/grid';
import { PolicySubscriber } from 'ls-core/session';
import { LabResultDetailGridColumnsBuilder } from './lab-result-detail-grid-columns.builder';

@Component({
    selector: 'lab-result-detail',
    templateUrl: './lab-result-detail.component.html',
    providers: [PolicySubscriber, LabResultDetailGridColumnsBuilder]
})
export class LabResultDetailComponent extends BasePolicyGridViewModel<CustomerLabReportProxyModel> {
    private _customerLabReportData: CustomerLabReportProxyModel[];

    private _gridColumnsBuilder: LabResultDetailGridColumnsBuilder;

    constructor(injector: Injector, gridColumnsBuilder: LabResultDetailGridColumnsBuilder) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
    }

    public get customerLabReportData(): CustomerLabReportProxyModel[] {
        return this._customerLabReportData;
    }

    @Input()
    public set customerLabReportData(value: CustomerLabReportProxyModel[]) {
        this._customerLabReportData = value;
        this.refreshGrid();
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected loadItems(): Array<CustomerLabReportProxyModel> {
        return this.customerLabReportData;
    }

    protected setGridTitle(): string {
        return '';
    }

    protected getRowNodeId(data: CustomerLabReportProxyModel): Array<any> {
        return [data.RequirementInformationId, data.HorlCode];
    }

    protected getGridMinRows(): number {
        return DataGridRowNumber.Medium;
    }
}
