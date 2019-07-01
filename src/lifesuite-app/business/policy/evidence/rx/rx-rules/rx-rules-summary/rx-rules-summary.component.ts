import { Component, Injector, Input } from '@angular/core';
import { RxRulesSummaryProxy } from 'ls-core/model';
import { RxRulesSummaryColumnsBuilder } from './rx-rules-summary-grid-columns.builder';
import { BasePolicyGridViewModel } from 'business/policy/shared';
import {
    IGridColumnsBuilder,
    IDataGridOptions,
    DataGridColumns,
    DataGridOptionsUtil,
    DataGridCommonOptions
} from 'life-core/component/grid';
import { PolicySubscriber } from 'ls-core/session';
import { I18n } from 'life-core/i18n';

@Component({
    selector: 'rx-rules-summary',
    templateUrl: './rx-rules-summary.component.html',
    providers: [PolicySubscriber, RxRulesSummaryColumnsBuilder]
})
export class RxRulesSummaryComponent extends BasePolicyGridViewModel<RxRulesSummaryProxy> {
    private _rxRules: RxRulesSummaryProxy[];
    private _gridColumnBuilder: RxRulesSummaryColumnsBuilder;

    constructor(injector: Injector, gridColumnBuilder: RxRulesSummaryColumnsBuilder, i18n: I18n) {
        super(injector);
        this._gridColumnBuilder = gridColumnBuilder;
        this.i18n = i18n;
    }

    @Input()
    public set rxRules(value: RxRulesSummaryProxy[]) {
        this._rxRules = value;
        this.refreshGrid();
    }

    public getGridOptions(): IDataGridOptions {
        const gridColumns: DataGridColumns = this.getGridColumns();
        return DataGridOptionsUtil.getGridOptions(
            {
                rowData: this.loadItems(),
                columnDefs: gridColumns.getLayout(),
                rowSelection: 'single',
                rowDeselection: true,
                enableColResize: true,
                enableSorting: true,
                headerRows: 1,
                context: {
                    hostComponent: this
                }
            },
            DataGridCommonOptions
        );
    }

    public getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnBuilder;
    }

    public getRowNodeId(data: RxRulesSummaryProxy): any {
        return data.PrescriptionDrugHeaderId;
    }

    protected loadItems(): RxRulesSummaryProxy[] {
        return this._rxRules || [];
    }

    protected setGridTitle(): string {
        return this.i18n({ value: 'RxRules Summary', id: 'policy.evidence.tab.label.rxrules' });
    }
}
