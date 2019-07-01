import { Injectable } from '@angular/core';
import { I18n } from 'life-core/i18n';

@Injectable({
    providedIn: 'root'
})
export class TabViewManagerResources {
    public deleteMessage: string;
    protected i18n: I18n;

    constructor(i18n: I18n) {
        this.i18n = i18n;
    }

    public getWarningItemDialogTitle(): string {
        return this.i18n({ value: 'Warning', id: 'component.tabview.manager.dialog.warning' });
    }

    public getWarningItemConfirmMessage(): string {
        return this.i18n({
            value: 'The maximum number of tabs are already open. Please close a tab before opening another.',
            id: 'component.tabview.manager.dialog.tabslimitreached'
        });
    }
}
