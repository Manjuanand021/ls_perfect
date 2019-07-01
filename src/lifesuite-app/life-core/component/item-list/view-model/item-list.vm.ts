import { Injector, Type } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ToasterMessage, ToasterSeverity, ToasterChannels } from 'life-core/component/toaster';
import { ItemOpenMode } from 'life-core/component/shared';
import { IMessagingService, MessagingService } from 'life-core/messaging';
import { ItemList } from '../item-list';
import { IItem, Item } from '../model/item';
import { ItemListButton } from '../model/item-list-button';
import { ItemEventData, CreateItemEventData } from '../event/item-event-data';
import { IItemListComponentResolver } from '../resolver/item-list-component.resolver';
import { ViewModel, ViewValidationParams, ViewValidationResult } from 'life-core/view-model';
import { SaveDataResult } from 'life-core/service';
import { CSS_TRANSITION_LENGTH } from 'life-core/util/animation';
import { Logger, ILogger } from 'life-core/logging';

export abstract class ItemListViewModel<TItemData> extends ViewModel<TItemData> {
    // Data store
    protected items: IItem<TItemData>[];

    /**
     * If this parameter is set to true, item will always be displayed in the edit mode.
     */
    public editModeOnly: boolean = false;

    public buttons: ItemListButton[];

    // RxJS Observable array of Items
    // Using BehaviorSubject will communicate to ItemList component
    // any changes to the data stream, including WebSocket/real-time changes
    private _sItems: BehaviorSubject<IItem<TItemData>[]>;

    // Observable data stream of Items;
    // Communicates data stream changes to ItemList component
    public oItems: Observable<IItem<TItemData>[]>;

    protected itemComponentResolver: IItemListComponentResolver<TItemData>;

    protected messagingService: IMessagingService;

    // private _rootObjectSetter: RootObjectSetter;

    private _sequenceCounter: number = 0;

    protected static Invalid_Message: string = 'Some data is invalid; please correct.';

    private _logger: ILogger;

    constructor(injector: Injector) {
        super(injector);

        this._sItems = <BehaviorSubject<IItem<TItemData>[]>>new BehaviorSubject([]);
        this.oItems = this._sItems.asObservable();
        this.messagingService = injector.get(MessagingService);
        this._logger = injector.get(Logger);
        // this._rootObjectSetter = rootObjectSetter;
        // this._logger = container.get(Logger);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.itemComponentResolver = this.getItemComponentResolver();
        this.buttons = this.getButtons();
        this.loadItems();
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.initSubscriptions();
    }

    protected setupNewItem(data: any): IItem<TItemData> {
        const item = new Item<TItemData>(data);
        item.id = data[this.itemDataIDPropertyName];
        item.sequenceId = this._sequenceCounter++;
        this._logger.log('sequenceId=', item.sequenceId);
        item.getViewModelTypeStrategy = this.getViewModelTypeStrategy;
        item.message = ItemListViewModel.Invalid_Message;
        return item;
    }

    protected getViewModelTypeStrategy = (item: IItem<TItemData>): Type<any> => {
        const openMode = item.selected ? ItemOpenMode.Edit : ItemOpenMode.View;
        return this.itemComponentResolver.resolve(item, openMode);
    };

    protected abstract getItemList(): ItemList<TItemData>;

    // protected abstract getRootObjects(): string[];

    protected get itemDataIDPropertyName(): string {
        return 'ID';
    }

    protected abstract getItemComponentResolver(): IItemListComponentResolver<TItemData>;

    // override this method to provide item list buttons
    protected getButtons(): ItemListButton[] {
        return [];
    }

    protected loadItems(): Promise<any> {
        this.items = [];
        return this.getItems().then(items => {
            this.items.push(...items);
            this._sItems.next(this.items);
        });
    }

    protected reloadItems(): Promise<any> {
        return this.loadItems();
    }

    protected abstract getItems(): Promise<IItem<TItemData>[]>;

    private onCreateItem(eventData: CreateItemEventData<TItemData>): Promise<IItem<TItemData>> {
        return this.createItem(eventData).then(data => {
            if (data == null) return;
            this.trackDirtyChange();
            this.setToasterMessage(
                new ToasterMessage({
                    severity: ToasterSeverity.SUCCESS,
                    summary: 'Item Created.'
                })
            );
            const item = this.setupNewItem(data);
            this.items.push(item);
            this._sItems.next(this.items);
            item.itemSelectedService.setSelected(true);
            eventData.callback(item);
            return item;
        });
    }

    private trackDirtyChange(): void {
        if (this.changeManager != null) {
            this.changeManager.setIsDirty(true);
        } else {
            // should we throw exception?
        }
    }

    protected abstract createItem(eventData: CreateItemEventData<TItemData>): Promise<any>;

    protected createDefaultItemIfNone(): void {
        if (this.items.length == 0) {
            this.createDefaultItem();
        }
    }

    protected createDefaultItem(): void {
        const callback = item => {
            this.getItemList().selectedItem = item;
        };
        const eventData = new CreateItemEventData<TItemData>(null, callback);
        this.onCreateItem(eventData);
    }

    private onRemoveItem(eventData: ItemEventData<TItemData>): Promise<void> {
        const item = eventData.item;
        return this.removeItem(item).then(result => {
            if (result) {
                this.trackDeletedChange(item.data);
                this.setToasterMessage(
                    new ToasterMessage({
                        severity: ToasterSeverity.SUCCESS,
                        summary: 'Item Deleted.'
                    })
                );
                item.deleted = true;
                item.visible = false;
                this._sItems.next(this.items);
                setTimeout(() => {
                    this.items.splice(this.items.indexOf(item), 1);
                    this._sItems.next(this.items);
                }, CSS_TRANSITION_LENGTH);
                this.resetValidationMessages();
            }
            eventData.callback(result);
        });
    }

    protected abstract removeItem(item: IItem<TItemData>): Promise<boolean>;

    private trackDeletedChange(itemData: any): void {
        if (this.changeManager != null) {
            this.changeManager.deleteObject(itemData);
        } else {
            // should we throw exception?
        }
    }

    protected loadItem(eventData: ItemEventData<TItemData>): Promise<void> {
        return new Promise<void>((accept, reject) => {
            eventData.callback(true);
            accept();
        });
    }

    private onEditItem(eventData: ItemEventData<TItemData>): void {
        this.activateItem(eventData.item).then(() => this.loadItem(eventData));
    }

    private activateItem(item: IItem<TItemData>): Promise<void> {
        // if (this.needToRegisterRootObjects()) {
        // 	return this.registerRootObjects(item);
        // } else {
        // 	return Promise.resolve(null);
        // }
        return Promise.resolve(null);
    }

    protected setToasterMessage(message: ToasterMessage): void {
        this.messagingService.publish(ToasterChannels.Message, message);
    }

    // private needToRegisterRootObjects(): boolean {
    // 	return this.getRootObjects().length > 0;
    // }

    // private registerRootObjects(item: IItem<TItemData>): Promise<any> {
    // 	let rootObject: string = this.getRootObjects()[0];
    // 	let rootObjectID: any = item.data[this.itemDataIDPropertyName];
    // 	return this._rootObjectSetter.set(rootObject, rootObjectID);
    // }

    protected isValidatable(): boolean {
        return true;
    }

    public validate(): Promise<ViewValidationResult> {
        if (this.selectedItem != null && this.needToValidate()) {
            const itemViewModel = <ViewModel>this.getItemList().getItemViewModel(this.selectedItem);
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
        // by default item list does not do form validation
        return new ViewValidationParams(this.routeName, this, false, null);
    }

    public saveData(): Promise<SaveDataResult> {
        if (this.selectedItem != null) {
            const itemViewModel = <ViewModel>this.getItemList().getItemViewModel(this.selectedItem);
            return itemViewModel.saveData();
        } else {
            return Promise.resolve(SaveDataResult.noNeedToSave);
        }
    }

    protected get selectedItem(): IItem<TItemData> {
        return this.items.find(item => {
            return item.selected == true;
        });
    }

    protected onSaveItem(eventData: ItemEventData<TItemData>): void {
        const itemViewModel = <ViewModel>this.getItemList().getItemViewModel(eventData.item);
        if (itemViewModel) {
            itemViewModel.saveData().then(() => {
                this.resetValidationMessages();
                eventData.callback(true);
            });
        }
    }

    private canDeactivateItem(eventData: ItemEventData<TItemData>): void {
        if (this.getItemList().editModeOnly) {
            // Don't validate each item if ItemList is editModeOnly;
            // In this case validation will take place when user leaves the view.
            return eventData.callback(true);
        } else {
            const itemViewModel = <ViewModel>this.getItemList().getItemViewModel(eventData.item);
            itemViewModel.canDeactivate().then(canDeactivate => {
                return eventData.callback(canDeactivate);
            });
        }
    }

    protected initSubscriptions(): void {
        this.subscriptionTracker.track([
            this.getItemList().eventEmitterCreateItem.subscribe(eventData => this.onCreateItem(eventData)),
            this.getItemList().eventEmitterRemoveItem.subscribe(eventData => this.onRemoveItem(eventData)),
            this.getItemList().eventEmitterEditItem.subscribe(eventData => this.onEditItem(eventData)),
            this.getItemList().eventEmitterSaveItem.subscribe(eventData => this.onSaveItem(eventData)),
            this.getItemList().eventEmitterCanDeactivateItem.subscribe(eventData => this.canDeactivateItem(eventData))
        ]);
    }
}
