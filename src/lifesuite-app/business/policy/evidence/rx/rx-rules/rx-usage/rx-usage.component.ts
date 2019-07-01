import { Component, Injector } from '@angular/core';

import {
    IGridColumnsBuilder,
    IDataGridOptions,
    DataGridColumns,
    DataGridOptionsUtil,
    DataGridCommonOptions
} from 'life-core/component/grid';
import { MIBCodingDTO, InsuredDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { RxUsageColumnsBuilder } from './rx-usage-grid-columns.builder';
import { BasePolicyGridViewModel, ApplicantListHelper } from 'business/policy/shared';
import { I18n } from 'life-core/i18n';

@Component({
    selector: 'rx-usage',
    templateUrl: './rx-usage.component.html',
    providers: [PolicySubscriber, RxUsageColumnsBuilder]
})
export class RxUsageComponent extends BasePolicyGridViewModel<MIBCodingDTO> {
    private _gridColumnsBuilder: RxUsageColumnsBuilder;
    private _applicant: InsuredDTO;
    private _applicantListHelper: ApplicantListHelper;

    constructor(
        injector: Injector,
        applicantListHelper: ApplicantListHelper,
        rxUsageColumnsBuilder: RxUsageColumnsBuilder,
        i18n: I18n
    ) {
        super(injector);
        this._applicantListHelper = applicantListHelper;
        this._gridColumnsBuilder = rxUsageColumnsBuilder;
        this.i18n = i18n;
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
        return this._gridColumnsBuilder;
    }

    public getRowNodeId(data: MIBCodingDTO): any {
        return data.PolicyPersonId;
    }

    public loadData(): Promise<void> {
        this.setApplicant();
        return super.loadData();
    }

    protected loadItems(): MIBCodingDTO[] {
        return this._applicant.MibCodings_LazyLoad.filter(item => item.RxRuleGenerated);
    }

    protected setGridTitle(): string {
        return this.i18n({ value: 'MIB Codes for Adverse Rx Usage', id: 'policy.rx.rules.codesummarysectiontitle' });
    }

    private setApplicant(): void {
        this._applicant = this._applicantListHelper.getActiveApplicantOrDefault(this.policy.Insureds_LazyLoad);
    }
}
