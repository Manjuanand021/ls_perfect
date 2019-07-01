import { Injectable } from '@angular/core';

import { MasterButtonLabels } from 'life-core/component/master-detail';
import { I18n } from 'life-core/i18n';
import { AppMasterButtonType } from './app-master-button';

@Injectable()
export class AppMasterButtonLabels extends MasterButtonLabels {
    private _button_note: string;
    public get button_note(): string {
        return this._button_note;
    }

    private _button_history: string;
    public get button_history(): string {
        return this._button_history;
    }

    private _button_void: string;
    public get button_void(): string {
        return this._button_void;
    }

    constructor(i18n: I18n) {
        super(i18n);
    }

    protected setupButtonLabels(): void {
        super.setupButtonLabels();
        this._button_note = this.i18n({ value: 'Note', id: 'master-detail.button.note' });
        this._button_history = this.i18n({ value: 'History', id: 'master-detail.button.history' });
        this._button_void = this.i18n({ value: 'Void', id: 'master-detail.button.void' });
    }

    protected setupButtonLabelMap(): void {
        super.setupButtonLabelMap();
        this.buttonLabelMap = {
            ...this.buttonLabelMap,
            [AppMasterButtonType.NOTE]: this.button_note,
            [AppMasterButtonType.HISTORY]: this.button_history,
            [AppMasterButtonType.VOID]: this.button_void
        };
    }
}
