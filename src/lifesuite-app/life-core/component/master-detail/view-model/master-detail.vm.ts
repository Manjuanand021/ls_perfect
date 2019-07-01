import { Injector, Type } from '@angular/core';

import {
    ModalDialog,
    ModalDialogParams,
    DialogButton,
    DialogButtonType,
    DialogSize,
    DefaultDialogSize,
    DialogResult
} from 'life-core/component/dialog';
import { I18n } from 'life-core/i18n';
import { IItemComponentResolver, DirectDataResolve, ButtonActionType, ItemOpenMode } from 'life-core/component/shared';
import { IDataGridOptions } from 'life-core/component/grid';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { ViewModel, ViewValidationParams, ViewValidationResult } from 'life-core/view-model';
import { SaveDataContext, SaveDataResult } from 'life-core/service';

import { MasterButton, MasterButtonType } from '../model/master-button';
import { MasterButtonLabels } from '../model/master-button-labels';
import { IBaseDataManager, BaseDataManager } from '../manager/base-data-manager';
import { IRowManagementDelegate, RowManagementDelegate } from '../manager/row-management.delegate';
import { ItemEventData, CreateItemEventData } from '../event/item-event-data';
import { MasterDetail } from '../master-detail';
import { MasterDetailComponentResolver } from '../resolver/master-detail-component.resolver';
import { MasterDetailViewModelResources } from './master-detail.rc';
import { IMasterDetailNotification, MasterDetailNotification } from '../notification/master-detail-notification';

export abstract class MasterDetailViewModel<T> extends ViewModel {
    // Data store
    protected items: T[] = [];

    public gridOptions: IDataGridOptions;

    public buttons: MasterButton<T>[];

    public title: string;

    protected masterDetailViewModelResources: MasterDetailViewModelResources;

    protected selectedItem: T;

    protected rowManagementDelegate: IRowManagementDelegate<T>;

    protected itemComponentResolver: IItemComponentResolver<T>;

    protected dataManager: IBaseDataManager<T>;

    protected masterDetailNotification: IMasterDetailNotification<T>;

    protected itemDetailDialog: ModalDialog;

    protected itemOpenMode: ItemOpenMode;

    protected messagingService: IMessagingService;

    protected masterButtonLabels: MasterButtonLabels;

    constructor(injector: Injector) {
        super(injector);
        this.i18n = injector.get(I18n);
        this.masterDetailViewModelResources = injector.get(MasterDetailViewModelResources);
        this.messagingService = injector.get(MessagingService);
        this.rowManagementDelegate = injector.get(RowManagementDelegate) as RowManagementDelegate<T>;
        this.itemComponentResolver = injector.get(MasterDetailComponentResolver);
        this.dataManager = injector.get(BaseDataManager) as BaseDataManager<T>;
        this.masterDetailNotification = injector.get(MasterDetailNotification) as IMasterDetailNotification<T>;
        this.itemDetailDialog = this.injector.get(ModalDialog);
        this.masterButtonLabels = this.injector.get(MasterButtonLabels);
        this.title = this.getTitle();
        // this._logger = injector.get(Logger);
    }

    // override this method to provide master detail title
    protected getTitle(): string {
        return '';
    }

    public abstract get showDetailAsPopup(): boolean;

    public ngOnInit(): any {
        super.ngOnInit();
        this.initMasterDetailData();
    }

    public prepareDataToSave(context: SaveDataContext): void {
        if (this.selectedItem && !this.showDetailAsPopup) {
            this.rowManagementDelegate.saveRow(this.selectedItem, context && context.isNavigatingAway ? false : true);
        }
    }

    protected initMasterDetailData(): void {
        this.buttons = this.getButtons();
        this.items = this.loadItems();
        this.initRowManagementDelegate();
        this.gridOptions = this.getGridOptions();

        this.subscriptionTracker.track(
            this.dataManager.getSelectedItem().subscribe(selectedItem => {
                this.selectedItem = selectedItem;
            })
        );
    }

    protected getButtons(): MasterButton<T>[] {
        const buttons = this.showDetailAsPopup ? this.getPopupDetailButtons() : this.getInlineDetailButtons();
        return this.setupButtons(buttons);
    }

    private setupButtons(buttons: MasterButton<T>[]): MasterButton<T>[] {
        for (const button of buttons) {
            this.setupButton(button);
        }
        return buttons;
    }

    private setupButton(button: MasterButton<T>): void {
        if (!button.label) {
            button.label = this.masterButtonLabels.byType[button.type];
        }
    }

    // Override this method to provide customized master buttons
    protected getPopupDetailButtons(): MasterButton<T>[] {
        return [
            new MasterButton({ type: MasterButtonType.ADD, actionType: ButtonActionType.DataChange }),
            new MasterButton({ type: MasterButtonType.EDIT, actionType: ButtonActionType.DataChange }),
            new MasterButton({ type: MasterButtonType.DELETE, actionType: ButtonActionType.DataChange })
        ];
    }

    // Override this method to provide customized master buttons
    protected getInlineDetailButtons(): MasterButton<T>[] {
        return [
            new MasterButton({ type: MasterButtonType.ADD, actionType: ButtonActionType.DataChange }),
            new MasterButton({ type: MasterButtonType.SAVE, actionType: ButtonActionType.DataChange }),
            new MasterButton({ type: MasterButtonType.CANCEL, actionType: ButtonActionType.DataChange }),
            new MasterButton({ type: MasterButtonType.DELETE, actionType: ButtonActionType.DataChange })
        ];
    }

    protected abstract loadItems(): T[];

    protected initRowManagementDelegate(): void {
        this.rowManagementDelegate.initDataManager(this.items);
    }

    public abstract getGridOptions(): IDataGridOptions;

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.initSubscriptions();
    }

    protected initSubscriptions(): void {
        const master = this.getMasterDetail().master;
        if (master) {
            this.subscriptionTracker.track([
                master.eventEmitterCreateItem.subscribe(eventData => this.onCreateItem(eventData)),
                master.eventEmitterRemoveItem.subscribe(eventData => this.onRemoveItem(eventData)),
                master.eventEmitterCancelItem.subscribe(eventData => this.onCancelItem(eventData)),
                master.eventEmitterSaveItem.subscribe(eventData => this.onSaveItem(eventData)),
                master.eventEmitterEditItem.subscribe(eventData => this.onEditItem(eventData)),
                master.eventEmitterCanDeactivateItem.subscribe(eventData => this.canDeactivateItem(eventData))
            ]);
        }
    }

    private onCreateItem(eventData: CreateItemEventData): Promise<T> {
        this.itemOpenMode = ItemOpenMode.Create;
        if (this.showDetailAsPopup) {
            return this.createItem(eventData).then(item => {
                return this.showItemDetailDialog(item).then(item => {
                    this.onItemCreated(item);
                    this.dataManager.setSelectedItem(item);
                    eventData.callback(item);
                    return item;
                });
            });
        } else {
            return this.createItem(eventData).then(item => {
                this.onItemCreated(item);
                eventData.callback(item);
                return item;
            });
        }
    }

    protected onItemCreated(item: T): void {
        if (item) {
            this.masterDetailNotification.notifyItemCreated(item);
        }
    }

    protected createItem(eventData: CreateItemEventData): Promise<T> {
        const newItem: T = this.rowManagementDelegate.addNewRow({
            items: this.items
        });
        return Promise.resolve(newItem);
    }

    protected getCreateItemDialogTitle(): string {
        return this.masterDetailViewModelResources.getCreateItemDialogTitle(this.getTitle());
    }

    protected getEditItemDialogTitle(): string {
        return this.masterDetailViewModelResources.getEditItemDialogTitle(this.getTitle());
    }

    protected getDeleteItemDialogTitle(): string {
        return this.masterDetailViewModelResources.getDeleteItemDialogTitle(this.getTitle());
    }

    protected getCopyItemDialogTitle(): string {
        return this.masterDetailViewModelResources.getCopyItemDialogTitle(this.getTitle());
    }

    protected getRemoveItemMessage(item: T): string {
        return this.masterDetailViewModelResources.getDeleteItemConfirmMessage();
    }

    protected getCopyItemMessage(): string {
        return this.masterDetailViewModelResources.getCopyItemMessage(this.getTitle());
    }

    protected showItemDetailDialog(item: T): Promise<T> {
        const dialogParams: ModalDialogParams = {
            view: this.getItemComponentType(item),
            data: item,
            resolve: this.getItemDetailDialogResolve(item),
            title: this.getItemDetailDialogTitle(),
            buttons: this.getItemDetailDialogButtons()
        };
        const dialogSize = this.getItemDetailDialogSize();
        if (dialogSize != DefaultDialogSize) {
            dialogParams.size = dialogSize as DialogSize;
        }
        return this.itemDetailDialog.open(dialogParams).then(dialogRef => {
            return dialogRef.result.then(result => {
                this.handleItemDetailDialogData(result, item);
                return this.isDialogButtonTypeOK(result.buttonId) ? this.selectedItem : null;
            });
        });
    }

    protected getItemComponentType(item: T): Type<any> {
        return this.itemComponentResolver.resolve(item, this.itemOpenMode);
    }

    protected getItemDetailDialogResolve(item: T): DirectDataResolve[] {
        return null;
    }

    protected getItemDetailDialogTitle(): string {
        if (this.itemOpenMode == ItemOpenMode.Create) {
            return this.getCreateItemDialogTitle();
        } else if (this.itemOpenMode == ItemOpenMode.Edit) {
            return this.getEditItemDialogTitle();
        }
    }

    protected getItemDetailDialogButtons(): DialogButton[] {
        return [
            new DialogButton({ type: DialogButtonType.OK }),
            new DialogButton({
                type: DialogButtonType.CANCEL,
                options: { isDefault: true }
            })
        ];
    }

    protected getItemDetailDialogSize(): DialogSize | string {
        return DefaultDialogSize;
    }

    protected handleItemDetailDialogData(dialogResult: DialogResult, item: T): void {
        if (this.isDialogButtonTypeOK(dialogResult.buttonId)) {
            this.onItemDetailDialogOKClick(item, dialogResult.dialogDirty);
        } else if (this.isDialogButtonTypeCancel(dialogResult.buttonId)) {
            this.onItemDetailDialogCancelClick(item, dialogResult.dialogDirty);
        }
    }

    protected onItemDetailDialogOKClick(item: T, dialogDirty: boolean): void {
        this.rowManagementDelegate.saveRow(item);
        this.changeManager.setIsDirty(dialogDirty);
    }

    protected onItemDetailDialogCancelClick(item: T, dialogDirty: boolean): void {
        this.rowManagementDelegate.cancelRowChanges(item);
    }

    private onRemoveItem(eventData: ItemEventData): Promise<void> {
        const item = eventData.item;
        return this.removeItem(item).then(result => {
            if (result) {
                this.onItemRemoved(eventData.item);
            }
            eventData.callback(result);
        });
    }

    protected removeItem(item: T): Promise<boolean> {
        this.rowManagementDelegate.deleteRow(item);
        return Promise.resolve(true);
    }

    protected onItemRemoved(item: T): void {
        this.masterDetailNotification.notifyItemRemoved(item);
        this.resetValidationMessages();
    }

    private onCancelItem(eventData: ItemEventData): void {
        this.rowManagementDelegate.cancelRowChanges(eventData.item);
        this.onItemCanceled(eventData.item);
    }

    protected onItemCanceled(item: T): void {
        this.masterDetailNotification.notifyItemCanceled(item);
    }

    protected loadItem(eventData: ItemEventData): Promise<void> {
        return new Promise<void>((accept, reject) => {
            eventData.callback(true);
            accept();
        });
    }

    protected onSaveItem(eventData: ItemEventData): void {
        if (this.showDetailAsPopup) {
            eventData.callback(true);
            return;
        }
        this.rowManagementDelegate.saveRow(eventData.item);
        this.onItemSaved(eventData.item);
        eventData.callback(true);
    }

    protected onItemSaved(item: T): void {
        this.masterDetailNotification.notifyItemSaved(item);
        this.resetValidationMessages();
    }

    protected onEditItem(eventData: ItemEventData): void {
        this.itemOpenMode = ItemOpenMode.Edit;
        this.showItemDetailDialog(eventData.item);
    }

    private canDeactivateItem(eventData: ItemEventData): void {
        if (this.showDetailAsPopup) {
            eventData.callback(true);
            return;
        }
        const itemViewModel = <ViewModel>this.getMasterDetail().getItemViewModel();
        itemViewModel.canDeactivate().then(canDeactivate => {
            return eventData.callback(canDeactivate);
        });
    }

    protected abstract getMasterDetail(): MasterDetail<T>;

    protected refreshMasterDetail(filterFunc?: any): void {
        if (this.gridOptions && this.gridOptions.api) {
            this.items = this.loadItems();
            this.getMasterDetail().master.clearSelection();
            this.rowManagementDelegate.setItems(this.items, filterFunc);
        }
    }

    public setActiveItem(item: T): void {
        this.getMasterDetail().setActiveItem(item);
    }

    protected isValidatable(): boolean {
        return true;
    }

    public validate(): Promise<ViewValidationResult> {
        if (this.showDetailAsPopup) return super.validate();
        if (this.selectedItem != null && this.needToValidate()) {
            const itemViewModel = <ViewModel>this.getMasterDetail().getItemViewModel();
            return itemViewModel.validate().then(selectedItemValidationResult => {
                if (selectedItemValidationResult == ViewValidationResult.pass) {
                    return super.validate();
                } else {
                    return Promise.resolve(ViewValidationResult.fail);
                }
            });
        } else {
            return super.validate();
        }
    }

    protected getValidationParams(): ViewValidationParams {
        // by default does not do form validation
        return new ViewValidationParams(this.routeName, this, false, null);
    }

    public saveData(context?: SaveDataContext): Promise<SaveDataResult> {
        if (this.selectedItem != null) {
            const publishSaveData = context ? !context.isNavigatingAway : true;
            this.rowManagementDelegate.saveRow(this.selectedItem, publishSaveData);
        }
        return super.saveData(context);
    }

    protected abstract isDialogButtonTypeOK(buttonType: string): boolean;

    protected isDialogButtonTypeCancel(buttonType: string): boolean {
        return buttonType === DialogButtonType.CANCEL || buttonType === DialogButtonType.DISMISS;
    }
}
