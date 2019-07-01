import { ButtonModel, ButtonActionType } from 'life-core/component/shared';

export class DialogButton extends ButtonModel {
    public options: DialogButtonOptions;
    public enabled?: boolean;

    constructor({
        type,
        label,
        handler,
        actionType,
        options,
        disabled,
        hidden
    }: {
        type: string;
        label?: string;
        handler?: Function;
        actionType?: ButtonActionType;
        options?: DialogButtonOptions;
        disabled?: boolean;
        hidden?: boolean;
    }) {
        super({
            type,
            label,
            handler,
            actionType,
            disabled,
            hidden
        });
        this.options = options;
    }
}

export interface DialogButtonOptions {
    readonly isDefault?: boolean;
    readonly isOk?: boolean;
    readonly isCancel?: boolean;
}

export enum DialogButtonType {
    /**
     * Dismiss - 'x' button in the dialog's title bar
     */
    DISMISS = 'button_dismiss',
    OK = 'button_ok',
    CANCEL = 'button_cancel',
    CLOSE = 'button_close',
    SAVE = 'button_save',
    ACCEPT = 'button_accept',
    ACCEPT_ADD = 'button_accept_add',
    YES = 'button_yes',
    NO = 'button_no',
    CONTINUE = 'button_continue',
    SELECT = 'button_select'
}
