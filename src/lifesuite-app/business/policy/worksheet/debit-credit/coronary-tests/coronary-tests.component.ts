import { Component, Injector } from '@angular/core';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { BaseDebitCreditGridViewModel } from '../base-debit-credit-grid-view-model';
import { DebitCreditHelper } from 'business/policy/shared';
import { CoronaryTestsColumnsBuilder } from './coronary-tests-grid-columns.builder';
import { PolicySubscriber } from 'ls-core/session';
import { RiskFactorSystemGeneratedTypes } from 'business/policy/worksheet/debit-credit';

@Component({
    selector: 'coronary-tests',
    templateUrl: './coronary-tests.component.html',
    providers: [PolicySubscriber, CoronaryTestsColumnsBuilder]
})
export class CoronaryTestsComponent extends BaseDebitCreditGridViewModel<any> {
    private _debitCreditHelper: DebitCreditHelper;
    private _gridColumnBuilder: CoronaryTestsColumnsBuilder;

    constructor(
        injector: Injector,
        debitCreditHelper: DebitCreditHelper,
        gridColumnBuilder: CoronaryTestsColumnsBuilder
    ) {
        super(injector);
        this._debitCreditHelper = debitCreditHelper;
        this._gridColumnBuilder = gridColumnBuilder;
    }

    protected loadItems(): any[] {
        const data = this._debitCreditHelper.getCoronaryTestGridInfo(this.insured);
        this.total = data.Total || 0;
        return data.Records || [];
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnBuilder;
    }

    protected getRowNodeId(data: any): RiskFactorSystemGeneratedTypes {
        return data.CAN;
    }

    protected setGridTitle(): string {
        return 'Coronary Tests';
    }
}
