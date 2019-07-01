import { IconData } from 'life-core/model';
import { MIBCodingValidationResultType } from './mib-coding-validation-result-type';

const mibValidationIconTitle = 'MIB Validation result';

export class MIBCodingValidationResultIconHelper {
    public static getIcon(validationResult: number): string {
        const iconData = this.getIconData(validationResult);
        return `<div title="${iconData.title}" class="${iconData.cssClass} grid-cell-icon"/>`;
    }

    private static getIconData(validationResult: number): IconData {
        let iconData: IconData;
        switch (validationResult) {
            case MIBCodingValidationResultType.VALID:
                iconData = new IconData('mib-validation-result-valid-icon', `${mibValidationIconTitle} VALID`);
                break;
            case MIBCodingValidationResultType.INVALID:
                iconData = new IconData('mib-validation-result-invalid-icon', `${mibValidationIconTitle} INVALID`);
                break;
            case MIBCodingValidationResultType.VALID_NOT_REPORTED:
                iconData = new IconData(
                    'mib-validation-result-valid-not-reported-icon',
                    `${mibValidationIconTitle} Valid or NOT REPORTED`
                );
                break;
            default:
                iconData = new IconData('mib-validation-result-pending-icon', `${mibValidationIconTitle} PENDING`);
                break;
        }
        return iconData;
    }
}
