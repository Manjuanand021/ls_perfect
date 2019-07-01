import { Component, Injector, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';

import { InputUtil } from 'life-core/component/input';
import { CrediCardExpirationDateModel } from 'life-core/component/input/inputcreditcardexpiration';
import { ListItem } from 'life-core/model/list.model';
import { ViewModel } from 'life-core/view-model';
import { MAX_INTEGER32 } from 'life-core/util/lang';

import { PolicySubscriber } from 'ls-core/session';
import { CreditCardExpirationUtil } from 'ls-core/component/input/shared/creditcardexpiration.util';
import { PolicyDataModel } from 'business/policy/shared/data-model';

@Component({
    selector: 'case-payment',
    templateUrl: './case-payment.component.html',
    providers: [PolicySubscriber]
})
export class CasePaymentComponent extends ViewModel<PolicyDataModel> {
    @ViewChild('creditCardExpirationNgModel')
    public creditCardExpirationNgModel: NgModel;
    public isCreditCardRequired: boolean;
    public readonly maxBillingDayValue: number = MAX_INTEGER32;

    constructor(injector: Injector, policySubscriber: PolicySubscriber) {
        super(injector);
        policySubscriber.subscribe(this, p => {
            this.data.policy = p;
        });
    }

    public onCreditCardTypeChange(creditCardType: ListItem): void {
        this.resetCreditCardInfo();
        this.updateCreditCardRequired();
    }

    public onCreditCardExpirationChange(creditCardExpiration: CrediCardExpirationDateModel): void {
        CreditCardExpirationUtil.fromCreditCardExpirationModel(creditCardExpiration, this.data.policy);
    }

    public onBankAccountTypeChange(selectedBankAccountType: any): void {
        const selectedBankAccountTypeValue: string = selectedBankAccountType ? selectedBankAccountType.value : null;
        if (!selectedBankAccountTypeValue) {
            this.resetBankAccountInfo();
            this.resetBillInfo();
        }
    }

    protected setupData(): void {
        this.setResolvedListData();
        this.updateCreditCardRequired();
        this.initializeBillDay();
    }

    private initializeBillDay(): void {
        if (!this.data.policy.BillDay) {
            this.data.policy.BillDay = 0;
        }
    }

    private updateCreditCardRequired(): void {
        this.isCreditCardRequired = !!this.data.policy.CreditCardType;
    }

    private resetCreditCardInfo(): void {
        this.data.policy.creditCardAccountNameDecrypted = '';
        this.data.policy.creditCardNumberDecrypted = '';
        this.data.policy.creditCardExpirationMonthDecrypted = '';
        this.data.policy.creditCardExpirationYearDecrypted = '';
        // Set the expiration date control ngModel in order to trigger UI refresh
        InputUtil.setComponentNgModelValue(
            this.creditCardExpirationNgModel,
            CreditCardExpirationUtil.toCreditCardExpirationModel(this.data.policy)
        );
    }

    private resetBankAccountInfo(): void {
        this.data.policy.bankTransactionNumberDecrypted = '';
        this.data.policy.BankNameOnAccount = '';
        this.data.policy.bankAccountNameDecrypted = '';
        this.data.policy.bankRountingNumberDecrypted = '';
        this.data.policy.bankAccountNumberDecrypted = '';
    }

    private resetBillInfo(): void {
        this.data.policy.ListBillLocation = '';
        this.data.policy.ListBillEmployeeId = '';
    }
}
