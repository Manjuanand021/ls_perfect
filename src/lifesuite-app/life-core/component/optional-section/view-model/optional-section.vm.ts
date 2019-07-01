import { Injector, Type } from '@angular/core';

import { ConfirmDialog, DialogButton, DialogButtonType, DialogResult } from 'life-core/component/dialog';
import { ViewModel } from 'life-core/view-model';
import { OptionalSectionViewModelResources } from 'life-core/component/optional-section/view-model/optional-section.rc';
import { I18n } from 'life-core/i18n';

export abstract class OptionalSectionViewModel<TItem> extends ViewModel {
    public dataExists: boolean;

    public item: TItem;

    public itemComponentType: Type<any>;

    public title: string;

    protected confirmDialog: ConfirmDialog;

    protected optionalSectionViewModelResources: OptionalSectionViewModelResources;

    constructor(injector: Injector) {
        super(injector);
        this.i18n = injector.get(I18n);
        this.confirmDialog = injector.get(ConfirmDialog);
        this.optionalSectionViewModelResources = injector.get(OptionalSectionViewModelResources);
        this.title = this.getTitle();
    }

    protected updateProperties(): void {
        this.item = this.getItem();
        this.itemComponentType = this.item ? this.getItemComponentType() : null;
        this.dataExists = !!this.item;
    }

    protected abstract getItem(): TItem;

    protected abstract getItemComponentType(): Type<any>;

    public createItem(): void {
        this.executeCreateItem();
        this.changeManager.setIsDirty(true);
        this.updateProperties();
    }

    protected abstract executeCreateItem(): void;

    public removeItem(): void {
        this.confirmDelete().then(result => {
            const isRemoved = result.buttonId == DialogButtonType.OK;
            if (isRemoved) {
                this.dataExists = false;
                this.updateDeletedObjectArray(this.getItem());
                this.executeRemoveItem();
                this.updateProperties();
            }
        });
    }

    protected confirmDelete(): Promise<DialogResult> {
        return this.confirmDialog.open({
            title: this.getDeleteDialogTitle(),
            message: this.getDeleteDialogMessage(),
            buttons: [
                new DialogButton({ type: DialogButtonType.OK }),
                new DialogButton({ type: DialogButtonType.CANCEL, options: { isDefault: true } })
            ]
        });
    }

    protected updateDeletedObjectArray(item: TItem): void {
        if (this.changeManager != null && item) {
            this.changeManager.deleteObject(item);
        }
    }

    protected getTitle(): string {
        return '';
    }

    protected getDeleteDialogTitle(): string {
        return this.optionalSectionViewModelResources.getDeleteItemDialogTitle(this.getTitle());
    }

    protected getDeleteDialogMessage(): string {
        return this.optionalSectionViewModelResources.getDeleteItemConfirmMessage();
    }

    protected abstract executeRemoveItem(): void;
}
