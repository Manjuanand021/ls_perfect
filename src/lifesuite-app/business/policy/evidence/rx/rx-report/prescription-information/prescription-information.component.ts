import { Injector, Component, Input } from '@angular/core';

import { IGridColumnsBuilder, DataGridColumns } from 'life-core/component/grid';
import { I18n } from 'life-core/i18n';

import { RXReportProxy } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { BasePolicyGridViewModel } from 'business/policy/shared/grid/base-policy-grid.vm';
import { PrescriptionInformationGridColumnsBuilder } from './prescription-information-grid-columns.builder';

@Component({
    selector: 'prescription-information',
    templateUrl: './prescription-information.component.html',
    providers: [PolicySubscriber, PrescriptionInformationGridColumnsBuilder]
})
export class PrescriptionInformationComponent extends BasePolicyGridViewModel<RXReportProxy> {
    @Input()
    public prescriptionData: RXReportProxy[];
    private _gridColumnsBuilder: PrescriptionInformationGridColumnsBuilder;

    constructor(injector: Injector, gridColumnsBuilder: PrescriptionInformationGridColumnsBuilder, i18n: I18n) {
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
        return this.i18n({ value: 'Prescription Information', id: 'policy.rx.prescription.sectiontitle' });
    }

    protected getRowNodeId(data: RXReportProxy): any {
        return data.RXReportProxyId;
    }
}
