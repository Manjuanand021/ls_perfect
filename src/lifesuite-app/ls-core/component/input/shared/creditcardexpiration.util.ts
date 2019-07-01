import { CrediCardExpirationDateModel } from 'life-core/component/input/inputcreditcardexpiration';
import { PolicyDTO } from 'ls-core/model';

export class CreditCardExpirationUtil {
    public static toCreditCardExpirationModel(policy: PolicyDTO): CrediCardExpirationDateModel {
        const month = policy.creditCardExpirationMonthDecrypted;
        const year = policy.creditCardExpirationYearDecrypted;
        return (month && month.length > 0) || (year && year.length > 0) ? { month: month, year: year } : null;
    }

    public static fromCreditCardExpirationModel(model: CrediCardExpirationDateModel, policy: PolicyDTO): PolicyDTO {
        if (model) {
            policy.creditCardExpirationMonthDecrypted = model.month;
            policy.creditCardExpirationYearDecrypted = model.year;
        }
        return policy;
    }
}
