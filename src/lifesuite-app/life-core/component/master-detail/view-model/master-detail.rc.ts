import { Injectable } from '@angular/core';
import { I18n } from 'life-core/i18n';

@Injectable({
    providedIn: 'root'
})
export class MasterDetailViewModelResources {
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

    public getEditItemDialogTitle(dialogTitle: string): string {
        return this.i18n(
            { value: 'Edit {{title}}', id: 'component.masterdetail.dialog.edititem.title' },
            { title: dialogTitle }
        );
    }

    public getDeleteItemDialogTitle(dialogTitle: string): string {
        return this.i18n(
            { value: 'Delete {{title}} Confirmation', id: 'component.masterdetail.dialog.deleteitem.title' },
            { title: dialogTitle }
        );
    }
    public getCopyItemDialogTitle(dialogTitle: string): string {
        return this.i18n(
            { value: 'Copy {{title}}', id: 'component.masterdetail.dialog.copyitem.title' },
            { title: dialogTitle }
        );
    }

    public getDeleteItemConfirmMessage(): string {
        return this.i18n({
            value: 'Are you sure you want to delete the selected item?',
            id: 'general.dialog.delete.message'
        });
    }

    public getCopyItemMessage(dialogTitle: string): string {
        return this.i18n(
            {
                value:
                    'Confirm if you want to create a copy of selected record. A copy of selected record will be created in the {{title}} list',
                id: 'general.dialog.copy.message'
            },
            { title: dialogTitle }
        );
    }

    public getItemCreatedMessage(): string {
        return this.i18n({
            value: 'Item Created.',
            id: 'component.master-detail.toastermessages.created'
        });
    }

    public getItemDeletedMessage(): string {
        return this.i18n({
            value: 'Item Deleted.',
            id: 'component.master-detail.toastermessages.deleted'
        });
    }

    public getItemChangesCanceledMessage(): string {
        return this.i18n({
            value: 'Changes Canceled.',
            id: 'component.master-detail.toastermessages.changescanceled'
        });
    }

    public getItemSavedMessage(): string {
        return this.i18n({
            value: 'Item Saved.',
            id: 'component.master-detail.toastermessages.saved'
        });
    }
}
