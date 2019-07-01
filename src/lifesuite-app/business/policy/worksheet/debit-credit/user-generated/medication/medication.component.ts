import { Component, Injector } from '@angular/core';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { BaseDebitCreditGridViewModel } from '../../base-debit-credit-grid-view-model';
import { DebitCreditHelper } from 'business/policy/shared';
import { MedicationDTO } from 'ls-core/model';
import { MedicationColumnsBuilder } from './medication-grid-columns.builder';
import { PolicySubscriber } from 'ls-core/session';
import { RiskFactorSourceType } from '../../';
import { I18n } from 'life-core/i18n';

@Component({
    selector: 'medication',
    templateUrl: './medication.component.html',
    providers: [PolicySubscriber, MedicationColumnsBuilder]
})
export class MedicationComponent extends BaseDebitCreditGridViewModel<MedicationDTO> {
    private _debitCreditHelper: DebitCreditHelper;

    private _gridColumnsBuilder: MedicationColumnsBuilder;
    constructor(
        injector: Injector,
        gridColumnsBuilder: MedicationColumnsBuilder,
        debitCreditHelper: DebitCreditHelper,
        i18n: I18n
    ) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
        this._debitCreditHelper = debitCreditHelper;
        this.i18n = i18n;
    }

    protected loadItems(): MedicationDTO[] {
        const data = this._debitCreditHelper.getMedicationGridInfo(this.insured, RiskFactorSourceType.USER_GENERATED);
        this.total = data.Total || 0;
        return data.Records || [];
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getRowNodeId(data: MedicationDTO): number {
        return data.MedicationId;
    }

    protected setGridTitle(): string {
        return this.i18n({ value: 'Other Medication', id: 'policy.worksheet.debitcredit.othermedication' });
    }
}
