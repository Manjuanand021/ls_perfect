import { AuthorizationLevel } from 'life-core/authorization';

export class ButtonModel {
    public type: string;
    public label?: string;
    public handler?: Function;
    public actionType?: ButtonActionType;
    public authorizationLevel?: AuthorizationLevel;
    public buttonClass?: string;
    public disabled: boolean;
    public hidden: boolean;
    constructor({
        type,
        label,
        handler,
        actionType,
        authorizationLevel,
        buttonClass,
        disabled = false,
        hidden = false
    }: {
        type: string;
        label?: string;
        handler?: Function;
        actionType?: ButtonActionType;
        authorizationLevel?: AuthorizationLevel;
        buttonClass?: string;
        disabled?: boolean;
        hidden?: boolean;
    }) {
        this.type = type;
        this.label = label;
        this.handler = handler;
        this.actionType = actionType;
        this.authorizationLevel = authorizationLevel;
        this.buttonClass = buttonClass;
        this.disabled = disabled;
        this.hidden = hidden;
    }
}

export enum ButtonActionType {
    DataChange = 1,
    Presentation = 2
}
