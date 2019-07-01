import { Component, Injector } from '@angular/core';

import { ICompose } from 'life-core/component/compose';
import { PolicySubscriber } from 'ls-core/session';
import { IDataGridOptions, IGridColumnsBuilder } from 'life-core/component/grid';
import { AuthorizationProvider } from 'life-core/authorization';
import { NamePattern } from 'life-core/util/formatter/name-pattern';
import { NameUtil } from 'life-core/util';
import { I18n } from 'life-core/i18n';

import { MIBCodeDTO } from 'ls-core/model';
import { BasePolicyGridViewModel } from 'business/policy/shared';
import { MIBReportCodeColumnsBuilder } from './mib-report-codes-columns.builder';
import { MibDetailAuthorizationProvider } from './../../../mib-detail-authorization.provider';

@Component({
    selector: 'mib-report-item-detail',
    templateUrl: './mib-report-item-detail.component.html',
    providers: [
        PolicySubscriber,
        MIBReportCodeColumnsBuilder,
        { provide: AuthorizationProvider, useClass: MibDetailAuthorizationProvider }
    ]
})
export class MIBReportItemDetailComponent extends BasePolicyGridViewModel<MIBCodeDTO> implements ICompose {
    public mibName: string;

    private _gridColumnsBuilder: MIBReportCodeColumnsBuilder;

    public gridOptions: IDataGridOptions;

    public recordCount: number;

    public title: string;

    constructor(injector: Injector, gridColumnsBuilder: MIBReportCodeColumnsBuilder, i18n: I18n) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
        this.i18n = i18n;
    }

    protected setGridTitle(): string {
        return this.i18n({ value: 'MIB Code', id: 'policy.mib.submitted.codes.gridheader.mibcode' });
    }

    private get MibCodes(): MIBCodeDTO[] {
        return this.data.Codes_LazyLoad;
    }

    public setModel(model: any): void {
        this.setContext(model);
    }

    private setContext(context: any): void {
        this.data = context;
        this.setMibName();
        this.setRecordsCount();
        this.refreshGrid();
    }

    private setMibName(): void {
        this.mibName = NameUtil.getFullNameWithMiddleInitial({
            firstName: this.data.FirstName,
            lastName: this.data.LastName,
            pattern: NamePattern.FirstAndLastName
        });
    }

    private setRecordsCount(): void {
        this.recordCount = this.MibCodes ? this.MibCodes.length : 0;
    }

    protected loadItems(): MIBCodeDTO[] {
        return this.MibCodes;
    }

    protected getRowNodeId(data: MIBCodeDTO): any {
        return data.SeqNumber;
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }
}
