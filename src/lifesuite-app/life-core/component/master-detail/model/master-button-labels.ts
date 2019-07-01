import { Injectable } from '@angular/core';

import { ComponentButtonLabels } from 'life-core/component/shared';
import { I18n } from 'life-core/i18n';
import { MasterButtonType } from './master-button';

@Injectable()
export class MasterButtonLabels extends ComponentButtonLabels {
    private _button_add: string;
    public get button_add(): string {
        return this._button_add;
    }

    private _button_cancel: string;
    public get button_cancel(): string {
        return this._button_cancel;
    }

    private _button_copy: string;
    public get button_copy(): string {
        return this._button_copy;
    }

    private _button_delete: string;
    public get button_delete(): string {
        return this._button_delete;
    }

    private _button_edit: string;
    public get button_edit(): string {
        return this._button_edit;
    }

    private _button_save: string;
    public get button_save(): string {
        return this._button_save;
    }

    private _button_undo: string;
    public get button_undo(): string {
        return this._button_undo;
    }

    constructor(i18n: I18n) {
        super(i18n);
    }
    protected setupButtonLabels(): void {
        this._button_add = this.i18n({ value: 'Add', id: 'component.master-detail.button.add' });
        this._button_cancel = this.i18n({ value: 'Cancel', id: 'component.master-detail.button.cancel' });
        this._button_copy = this.i18n({ value: 'Copy', id: 'component.master-detail.button.copy' });
        this._button_delete = this.i18n({ value: 'Delete', id: 'component.master-detail.button.delete' });
        this._button_edit = this.i18n({ value: 'Edit', id: 'component.master-detail.button.edit' });
        this._button_save = this.i18n({ value: 'Save', id: 'component.master-detail.button.save' });
        this._button_undo = this.i18n({ value: 'Undo', id: 'component.master-detail.button.undo' });
    }

    protected setupButtonLabelMap(): void {
        this.buttonLabelMap = {
            [MasterButtonType.ADD]: this.button_add,
            [MasterButtonType.CANCEL]: this.button_cancel,
            [MasterButtonType.COPY]: this.button_copy,
            [MasterButtonType.DELETE]: this.button_delete,
            [MasterButtonType.EDIT]: this.button_edit,
            [MasterButtonType.SAVE]: this.button_save
        };
    }
}
