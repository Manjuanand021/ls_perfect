import { Injectable } from '@angular/core';

import { I18n } from 'life-core/i18n';
import { ItemListButtonType } from './item-list-button';

@Injectable({
    providedIn: 'root'
})
export class ItemListButtonLabels {
    public readonly byType: { readonly [type: string]: string };

    public readonly button_add: string;
    public readonly button_delete: string;
    public readonly button_edit: string;
    public readonly button_save: string;

    constructor(i18n: I18n) {
        this.button_add = i18n({ value: 'Add', id: 'component.item-list.button.add' });
        this.button_delete = i18n({ value: 'Delete', id: 'component.item-list.button.delete' });
        this.button_edit = i18n({ value: 'Edit', id: 'component.item-list.button.edit' });
        this.button_save = i18n({ value: 'Save', id: 'component.item-list.button.save' });

        this.byType = {
            [ItemListButtonType.ADD]: this.button_add,
            [ItemListButtonType.DELETE]: this.button_delete,
            [ItemListButtonType.EDIT]: this.button_edit,
            [ItemListButtonType.SAVE]: this.button_save
        };
    }
}
