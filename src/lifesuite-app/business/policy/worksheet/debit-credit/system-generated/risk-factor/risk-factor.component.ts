import { Component, Injector } from '@angular/core';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { WorksheetRowDTO } from 'ls-core/model';
import { BaseDebitCreditGridViewModel } from '../../base-debit-credit-grid-view-model';
import { DebitCreditHelper } from 'business/policy/shared';
import { RiskFactorColumnsBuilder } from './risk-factor-grid-columns.builder';
import { PolicySubscriber } from 'ls-core/session';
import { RiskFactorSourceType } from '../../';

@Component({
    selector: 'risk-factor',
    templateUrl: './risk-factor.component.html',
    providers: [PolicySubscriber, RiskFactorColumnsBuilder]
})
export class RiskFactorComponent extends BaseDebitCreditGridViewModel<WorksheetRowDTO> {
    private _debitCreditHelper: DebitCreditHelper;
    private _gridColumenBuilder: RiskFactorColumnsBuilder;

    constructor(
        injector: Injector,
        debitCreditHelper: DebitCreditHelper,
        gridColumenBuilder: RiskFactorColumnsBuilder
    ) {
        super(injector);
        this._debitCreditHelper = debitCreditHelper;
        this._gridColumenBuilder = gridColumenBuilder;
    }

    protected loadItems(): WorksheetRowDTO[] {
        const data = this._debitCreditHelper.getRiskFactorGridInfo(this.insured, RiskFactorSourceType.SYSTEM_GENERATED);
        this.total = data.Total || 0;
        return data.Records || [];
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumenBuilder;
    }

    protected getRowNodeId(data: WorksheetRowDTO): Object {
        return data.CoveragePersonWorksheetId;
    }

    protected setGridTitle(): string {
        return '';
    }
}
