import { Injectable } from '@angular/core';

import { ComponentButtonLabels } from 'life-core/component/shared';
import { I18n } from 'life-core/i18n';
import { DialogButtonType } from 'life-core/component/dialog/shared/dialog-button';

@Injectable({
    providedIn: 'root'
})
export class DialogButtonLabels extends ComponentButtonLabels {
    private _button_ok: string;
    public get button_ok(): string {
        return this._button_ok;
    }

    private _button_cancel: string;
    public get button_cancel(): string {
        return this._button_cancel;
    }

    private _button_close: string;
    public get button_close(): string {
        return this._button_close;
    }

    private _button_save: string;
    public get button_save(): string {
        return this._button_save;
    }

    private _button_accept: string;
    public get button_accept(): string {
        return this._button_accept;
    }

    private _button_accept_add: string;
    public get button_accept_add(): string {
        return this._button_accept_add;
    }

    private _button_yes: string;
    public get button_yes(): string {
        return this._button_yes;
    }

    private _button_no: string;
    public get button_no(): string {
        return this._button_no;
    }

    private _button_continue: string;
    public get button_continue(): string {
        return this._button_continue;
    }

    private _button_select: string;
    public get button_select(): string {
        return this._button_select;
    }

    constructor(i18n: I18n) {
        super(i18n);
    }

    protected setupButtonLabels(): void {
        this._button_ok = this.i18n({ value: 'OK', id: 'component.dialog.button.ok' });
        this._button_cancel = this.i18n({ value: 'Cancel', id: 'component.dialog.button.cancel' });
        this._button_close = this.i18n({ value: 'Close', id: 'component.dialog.button.close' });
        this._button_save = this.i18n({ value: 'Save', id: 'component.dialog.button.save' });
        this._button_accept = this.i18n({ value: 'Accept', id: 'component.dialog.button.accept' });
        this._button_accept_add = this.i18n({ value: 'Accept/Add', id: 'component.dialog.button.accept_add' });
        this._button_yes = this.i18n({ value: 'Yes', id: 'component.dialog.button.yes' });
        this._button_no = this.i18n({ value: 'No', id: 'component.dialog.button.no' });
        this._button_continue = this.i18n({ value: 'Continue', id: 'component.dialog.button.continue' });
        this._button_select = this.i18n({ value: 'Select', id: 'component.dialog.button.select' });
    }

    protected setupButtonLabelMap(): void {
        this.buttonLabelMap = {
            [DialogButtonType.OK]: this.button_ok,
            [DialogButtonType.NO]: this.button_no,
            [DialogButtonType.CANCEL]: this.button_cancel,
            [DialogButtonType.CLOSE]: this.button_close,
            [DialogButtonType.SAVE]: this.button_save,
            [DialogButtonType.ACCEPT]: this.button_accept,
            [DialogButtonType.ACCEPT_ADD]: this.button_accept_add,
            [DialogButtonType.YES]: this.button_yes,
            [DialogButtonType.CONTINUE]: this.button_continue,
            [DialogButtonType.SELECT]: this.button_select
        };
    }
}
