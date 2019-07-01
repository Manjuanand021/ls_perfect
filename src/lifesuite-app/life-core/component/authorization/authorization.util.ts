import { AuthorizationLevel } from 'life-core/authorization';
import { ButtonActionType } from 'life-core/component/shared/button/button.model';
import { DropdownActionType } from '../input/dropdown/dropdown-action-type';

export class AuthorizationUtil {
    public static isInputComponentEnabled(authorizationLevel: AuthorizationLevel): boolean {
        return levelDefined(authorizationLevel) ? authorizationLevel > AuthorizationLevel.VIEW : true;
        // return authorizationLevel < AuthorizationLevel.VIEW;
    }

    public static isInputComponentDisabled(authorizationLevel: AuthorizationLevel): boolean {
        return !AuthorizationUtil.isInputComponentEnabled(authorizationLevel);
    }
    public static isInputSelectComponentEnabled(
        authorizationLevel: AuthorizationLevel,
        actionType: DropdownActionType
    ): boolean {
        // disable only DataChange type dropdowns
        return actionType === DropdownActionType.DataChange
            ? AuthorizationUtil.isInputComponentEnabled(authorizationLevel)
            : authorizationLevel > AuthorizationLevel.NONE;
    }

    public static isInputSelectComponentDisabled(
        authorizationLevel: AuthorizationLevel,
        actionType: DropdownActionType
    ): boolean {
        return !AuthorizationUtil.isInputSelectComponentEnabled(authorizationLevel, actionType);
    }

    public static isInputComponentVisible(authorizationLevel: AuthorizationLevel): boolean {
        return levelDefined(authorizationLevel) ? authorizationLevel > AuthorizationLevel.NONE : true;
    }

    public static isInputComponentHidden(authorizationLevel: AuthorizationLevel): boolean {
        return !AuthorizationUtil.isInputComponentVisible(authorizationLevel);
    }

    public static isLayoutComponentEnabled(authorizationLevel: AuthorizationLevel): boolean {
        return levelDefined(authorizationLevel) ? authorizationLevel > AuthorizationLevel.NONE : true;
    }

    public static isLayoutComponentVisible(authorizationLevel: AuthorizationLevel): boolean {
        return levelDefined(authorizationLevel) ? authorizationLevel > AuthorizationLevel.NONE : true;
    }

    public static isActionComponentEnabled(
        authorizationLevel: AuthorizationLevel,
        actionType: ButtonActionType
    ): boolean {
        if (levelDefined(authorizationLevel)) {
            // disable only DataChange type buttons
            return actionType === ButtonActionType.DataChange
                ? authorizationLevel > AuthorizationLevel.VIEW
                : authorizationLevel > AuthorizationLevel.NONE;
        }
        return true;
    }

    public static isActionComponentVisible(authorizationLevel: AuthorizationLevel): boolean {
        return levelDefined(authorizationLevel) ? authorizationLevel > AuthorizationLevel.NONE : true;
    }
}

function levelDefined(level: AuthorizationLevel): boolean {
    return level !== undefined;
}
