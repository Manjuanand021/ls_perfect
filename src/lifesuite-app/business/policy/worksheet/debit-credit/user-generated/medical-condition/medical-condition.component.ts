import { Component, Injector } from '@angular/core';
import { IGridColumnsBuilder } from 'life-core/component/grid';
import { BaseDebitCreditGridViewModel } from '../../base-debit-credit-grid-view-model';
import { DebitCreditHelper } from 'business/policy/shared';
import { MedicalConditionDTO } from 'ls-core/model';
import { MedicalConditionColumnsBuilder } from './medical-condition-grid-columns.builder';
import { PolicySubscriber } from 'ls-core/session';
import { RiskFactorSourceType } from '../../';
import { I18n } from 'life-core/i18n';

@Component({
    selector: 'medical-condition',
    templateUrl: './medical-condition.component.html',
    providers: [PolicySubscriber, MedicalConditionColumnsBuilder]
})
export class MedicalConditionComponent extends BaseDebitCreditGridViewModel<MedicalConditionDTO> {
    private _debitCreditHelper: DebitCreditHelper;
    private _gridColumnsBuilder: MedicalConditionColumnsBuilder;

    constructor(
        injector: Injector,
        gridColumnsBuilder: MedicalConditionColumnsBuilder,
        debitCreditHelper: DebitCreditHelper,
        i18n: I18n
    ) {
        super(injector);
        this._gridColumnsBuilder = gridColumnsBuilder;
        this._debitCreditHelper = debitCreditHelper;
        this.i18n = i18n;
    }

    protected loadItems(): MedicalConditionDTO[] {
        const data = this._debitCreditHelper.getMedicalConditionGridInfo(
            this.insured,
            RiskFactorSourceType.USER_GENERATED
        );
        this.total = data.Total || 0;
        return data.Records || [];
    }

    protected getGridColumnsBuilder(): IGridColumnsBuilder {
        return this._gridColumnsBuilder;
    }

    protected getRowNodeId(data: MedicalConditionDTO): Object {
        return data.MedicalConditionId;
    }

    protected setGridTitle(): string {
        return this.i18n({ value: 'Medical Condition', id: 'policy.worksheet.debitcredit.medicalcondition' });
    }
}
