import { IconData } from 'life-core/model';
import { ConvertUtil } from 'life-core/util/lang';
import { Prompt } from 'business/policy/shared';

export class CoverageValidationIconHelper {
    public static getIcon(message: Prompt): string {
        const iconData = this.getIconData(message);
        return `<div class="${iconData.cssClass} grid-cell-icon"/>`;
    }

    private static getIconData(message: Prompt): IconData {
        let iconData: IconData;
        switch (message.Type) {
            case 'Info': {
                iconData = new IconData('ls-info-validation-message-icon', 'Information');
                break;
            }
            case 'Required': {
                iconData = new IconData('ls-required-validation-message-icon', 'Required Message');
                break;
            }
            case 'Overridable': {
                iconData = new IconData('ls-overridable-validation-message-icon', 'Overridable Message');
                break;
            }
        }
        return iconData;
    }
}
