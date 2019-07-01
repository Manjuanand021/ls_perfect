import { AuthorizationLevel } from 'life-core/authorization';
import { PopoverDialogParams } from 'life-core/component/dialog';
import { ButtonModel, ButtonActionType } from 'life-core/component/shared';

export class MasterButton<T> extends ButtonModel {
    public dialog: PopoverDialogParams;
    public disableHandler: (item: T) => boolean;

    // menu: ButtonMenu

    constructor({
        type,
        label,
        actionType,
        buttonClass,
        handler,
        authorizationLevel,
        dialog,
        disabled,
        hidden,
        disableHandler
    }: {
        type: string;
        label?: string;
        actionType?: ButtonActionType;
        buttonClass?: string;
        handler?: Function;
        authorizationLevel?: AuthorizationLevel;
        dialog?: PopoverDialogParams;
        disabled?: boolean;
        hidden?: boolean;
        disableHandler?: (item: T) => boolean;
    }) {
        super({
            type,
            label,
            actionType,
            handler,
            authorizationLevel,
            buttonClass,
            disabled,
            hidden
        });
        this.dialog = dialog;
        this.disableHandler = disableHandler;
    }
}

export enum MasterButtonType {
    ADD = 'button_add',
    CANCEL = 'button_cancel',
    COPY = 'button_copy',
    DELETE = 'button_delete',
    EDIT = 'button_edit',
    SAVE = 'button_save'
}
