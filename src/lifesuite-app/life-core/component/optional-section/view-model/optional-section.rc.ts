import { Injectable } from '@angular/core';
import { I18n } from 'life-core/i18n';

@Injectable({
    providedIn: 'root'
})
export class OptionalSectionViewModelResources {
    public deleteMessage: string;
    protected i18n: I18n;

    constructor(i18n: I18n) {
        this.i18n = i18n;
    }

    public getCreateItemDialogTitle(dialogTitle: string): string {
        return this.i18n(
            { value: 'Add {{title}}', id: 'component.masterdetail.dialog.createitem.title' },
            { title: dialogTitle }
        );
    }

    public getDeleteItemDialogTitle(dialogTitle: string): string {
        return this.i18n(
            { value: 'Delete {{title}} Confirmation', id: 'component.masterdetail.dialog.deleteitem.title' },
            { title: dialogTitle }
        );
    }

    public getDeleteItemConfirmMessage(): string {
        return this.i18n({
            value: 'Are you sure you want to delete the selected item?',
            id: 'general.dialog.delete.message'
        });
    }
}
