import { Component, Injector, Input } from '@angular/core';

import { IGridColumnsBuilder, DataGridRowNumber } from 'life-core/component/grid';

import { VelogicaDetailDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';
import { BasePolicyGridViewModel } from 'business/policy/shared';
import { VelogicaReasonsDataColumnsBuilder } from './velogica-reasons-data-grid-columns.builder';

@Component({
    selector: 'velogica-reasons-data',
    templateUrl: 'velogica-reasons-data.component.html',
    providers: [PolicySubscriber, VelogicaReasonsDataColumnsBuilder]
})
export class VelogicaReasonsDataComponent extends BasePolicyGridViewModel<VelogicaDetailDTO> {
    public rowCount: number;
    private _gridColumnsBuilder: VelogicaReasonsDataColumnsBuilder;
    private _velogicaDetailList: VelogicaDetailDTO[];

    constructor(injector: Injector, gridColumnsBuilder: VelogicaReasonsDataColumnsBuilder) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
    }

    @Input()
    public set velogicaDetailList(value: VelogicaDetailDTO[]) {
        this._velogicaDetailList = value;
        this.rowCount = this.getRowCount();
        this.refreshGrid();
    }

    protected loadItems(): VelogicaDetailDTO[] {
        return this._velogicaDetailList || [];
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getRowNodeId(data: VelogicaDetailDTO): any {
        return data.VelogicaHeaderId;
    }

    protected setGridTitle(): string {
        return '';
    }

    protected getGridMinRows(): number {
        return DataGridRowNumber.Small;
    }

    private getRowCount(): number {
        return this._velogicaDetailList ? this._velogicaDetailList.length : 0;
    }
}
