import { CreditCardTypes } from 'life-core/component/input';

export class CreditCardUtil {
    public static getCreditCardType(creditCardId: string): string {
        return CreditCardTypeMap[creditCardId] ? CreditCardTypeMap[creditCardId] : CreditCardTypes.UNKNOWN;
    }
}

// List of credit card types in LifeSuite
export const CreditCardTypeMap: { readonly [type: string]: string } = {
    '1': CreditCardTypes.DISCOVER,
    '2': CreditCardTypes.VISA,
    '3': CreditCardTypes.MASTER_CARD,
    '4': CreditCardTypes.AMERICAN_EXPRESS,
    '5': CreditCardTypes.DINERS_CLUB
};
