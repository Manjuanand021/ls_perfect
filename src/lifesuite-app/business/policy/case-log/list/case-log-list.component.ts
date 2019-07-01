import { Component, Injector, Input } from '@angular/core';

import { ParentChildRegistry } from 'life-core/view-model/parent-child-registry/parent-child-registry';
import { DataGridColumns, BaseInfiniteGridViewModel } from 'life-core/component/grid';

import { PolicySubscriber } from 'ls-core/session/policy-subscriber';
import { LogEntryProxyDTO } from 'ls-core/model/dto/log-entry-proxy.dto';

import { CaseLogFilterModel } from 'business/policy/case-log/filter/case-log-filter.model';
import { GridDataStateKeys } from 'business/shared/grid';

import { CaseLogListGridDataSource } from '../datasource/case-log-list-grid-datasource';
import { CaseLogListColumnsBuilder } from './case-log-list-column.builder';
import { I18n } from 'life-core/i18n';

@Component({
    selector: 'case-log-list',
    templateUrl: './case-log-list.component.html',
    providers: [
        PolicySubscriber,
        ParentChildRegistry,
        CaseLogListColumnsBuilder,
        CaseLogListGridDataSource,
        CaseLogFilterModel
    ]
})
export class CaseLogListComponent extends BaseInfiniteGridViewModel<LogEntryProxyDTO> {
    @Input()
    public context: any;

    constructor(
        injector: Injector,
        gridColumnsBuilder: CaseLogListColumnsBuilder,
        gridDataSource: CaseLogListGridDataSource,
        caseLogFilterModel: CaseLogFilterModel,
        i18n: I18n
    ) {
        super(injector, gridDataSource, gridColumnsBuilder);
        this.filterModel = caseLogFilterModel;
        this.enableFilter = false;
        this.i18n = i18n;
    }

    public setCaseLogFilterModel(value: CaseLogFilterModel): void {
        this.filterModel = value;
        this.onFilterModelReceived(value);
    }

    public getGridColumns(): DataGridColumns {
        return this.getGridColumnsBuilder().build();
    }

    protected setupData(): void {
        this.title = this.setGridTitle();
    }

    protected registerFilterChangeHandlers(): void {}

    protected getGridStateKey(): string {
        return GridDataStateKeys.CASE_LOG;
    }

    // no implementation needed
    protected rowDataMatch(rowData1: LogEntryProxyDTO, rowData2: LogEntryProxyDTO): boolean {
        return false;
    }

    // no implementation needed
    protected openSelectedGridRow(): void {}

    protected setGridTitle(): string {
        return this.i18n({ value: 'Case Log', id: 'policy.case.log.title' });
    }
}
