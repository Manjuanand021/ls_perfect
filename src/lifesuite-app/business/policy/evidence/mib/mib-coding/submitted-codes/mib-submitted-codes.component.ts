import { Component, Injector, Input } from '@angular/core';

import { PolicySubscriber } from 'ls-core/session';
import { BasePolicyGridViewModel } from 'business/policy/shared/grid//base-policy-grid.vm';
import { IGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { MIBCodingDTO } from 'ls-core/model';
import { MIBSubmittedCodesColumnsBuilder } from './mib-submitted-codes-columns.builder';
import { I18n } from 'life-core/i18n';

@Component({
    selector: 'mib-submitted-codes',
    templateUrl: './mib-submitted-codes.component.html',
    providers: [PolicySubscriber, MIBSubmittedCodesColumnsBuilder]
})
export class MIBSubmittedCodesComponent extends BasePolicyGridViewModel<MIBCodingDTO> {
    @Input() public codes: MIBCodingDTO[];

    public mibName: string;

    private _gridColumnsBuilder: MIBSubmittedCodesColumnsBuilder;

    constructor(injector: Injector, gridColumnsBuilder: MIBSubmittedCodesColumnsBuilder, i18n: I18n) {
        super(injector);
        this.i18n = i18n;
        this._gridColumnsBuilder = gridColumnsBuilder;
    }
    public loadData(): Promise<void> {
        this.setResolvedMetaData();
        return super.loadData();
    }

    public getGridColumns(): DataGridColumns {
        return this._gridColumnsBuilder.build();
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected loadItems(): MIBCodingDTO[] {
        return this.codes || [];
    }

    protected setGridTitle(): string {
        return this.i18n({ value: 'Submitted MIB Codes', id: 'policy.mib.submitted.codes.submittedsectionlabel' });
    }

    protected getRowNodeId(data: MIBCodingDTO): any {
        return data.SequenceNumber;
    }
}
