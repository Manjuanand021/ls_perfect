import { ButtonModel } from 'life-core/component/shared';

export class ItemListButton extends ButtonModel {}

export enum ItemListButtonType {
    ADD = 'button_add',
    DELETE = 'button_delete',
    EDIT = 'button_edit',
    SAVE = 'button_save'
}
