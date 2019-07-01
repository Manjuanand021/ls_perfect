import { Injector, Component, Input } from '@angular/core';

import { IGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { RXReportProxy } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { BasePolicyGridViewModel } from 'business/policy/shared/grid/base-policy-grid.vm';
import { PhysicianGridColumnsBuilder } from './physician-grid-columns.builder';

@Component({
    selector: 'physician',
    templateUrl: './physician.component.html',
    providers: [PolicySubscriber, PhysicianGridColumnsBuilder]
})
export class PhysicianComponent extends BasePolicyGridViewModel<RXReportProxy> {
    @Input()
    public physicianData: RXReportProxy[];
    private _gridColumnsBuilder: PhysicianGridColumnsBuilder;

    constructor(injector: Injector, gridColumnsBuilder: PhysicianGridColumnsBuilder, i18n: I18n) {
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
        return this.physicianData;
    }

    protected setGridTitle(): string {
        return this.i18n({ value: 'Physicians', id: 'policy.rx.prescription.physicians' });
    }

    protected getRowNodeId(data: RXReportProxy): any {
        return data.RXReportProxyId;
    }
}
