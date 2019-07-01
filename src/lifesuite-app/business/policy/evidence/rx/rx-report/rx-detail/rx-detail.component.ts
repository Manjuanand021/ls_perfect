import { Injector, Component, Input } from '@angular/core';

import { BasePolicyGridViewModel } from 'business/policy/shared/grid/base-policy-grid.vm';
import { IGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { RXReportProxy } from 'ls-core/model';
import { RxDetailGridColumnsBuilder } from './rx-detail-grid-columns.builder';
import { PolicySubscriber } from 'ls-core/session';
import { I18n } from 'life-core/i18n';

@Component({
    selector: 'rx-detail',
    templateUrl: './rx-detail.component.html',
    providers: [PolicySubscriber, RxDetailGridColumnsBuilder]
})
export class RxDetailComponent extends BasePolicyGridViewModel<RXReportProxy> {
    @Input()
    public prescriptionData: RXReportProxy[];
    private _gridColumnsBuilder: RxDetailGridColumnsBuilder;

    constructor(injector: Injector, gridColumnsBuilder: RxDetailGridColumnsBuilder, i18n: I18n) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
        this.i18n = i18n;
    }

    public setupData(): void {
        this.setResolvedMetaData();
    }

    public getGridColumns(): DataGridColumns {
        return this._gridColumnsBuilder.build(this.listData['RxReport']);
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected loadItems(): RXReportProxy[] {
        return this.prescriptionData;
    }

    protected setGridTitle(): string {
        return this.i18n({ value: 'Rx Detail', id: 'policy.rx.prescription.rxdetail' });
    }

    protected getRowNodeId(data: RXReportProxy): any {
        return data.RXReportProxyId;
    }
}
