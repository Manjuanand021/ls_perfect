import { Injectable } from '@angular/core';

import { I18n } from 'life-core/i18n';
import { ComponentButtonLabels } from 'life-core/component/shared';
import { OptionalSectionButtonType } from './optional-section-button';

@Injectable({
    providedIn: 'root'
})
export class OptionalSectionButtonLabels extends ComponentButtonLabels {
    private _button_add: string;
    public get button_add(): string {
        return this._button_add;
    }
    private _button_delete: string;
    public get button_delete(): string {
        return this._button_delete;
    }

    constructor(i18n: I18n) {
        super(i18n);
    }

    protected setupButtonLabels(): void {
        this._button_add = this.i18n({ value: 'Add', id: 'component.optional-section.button.add' });
        this._button_delete = this.i18n({ value: 'Delete', id: 'component.optional-section.button.delete' });
    }

    protected setupButtonLabelMap(): void {
        this.buttonLabelMap = {
            [OptionalSectionButtonType.ADD]: this.button_add,
            [OptionalSectionButtonType.DELETE]: this.button_delete
        };
    }
}
