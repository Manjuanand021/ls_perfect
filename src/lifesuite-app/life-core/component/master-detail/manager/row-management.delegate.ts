import { IBaseDataManager, BaseDataManager } from './base-data-manager';
import { IItemFactory, BaseItemFactory, CreateItemParams } from './base-item.factory';

export interface IRowManagementDelegate<T> {
    itemDataIDPropertyName: string;
    initDataManager(items: Array<T>, filterFunc?: any): void;
    addNewRow(createItemParams: CreateItemParams<T>): T;
    deleteRow(item: T): void;
    cancelRowChanges(item: T): void;
    /**
     * Save the specified item.
     * @param item Item to be saved
     * @param doPublish Whether to publish saved item. This needs to be set to false
     * when navigating to other pages so that detail section is not getting refreshed and
     * router navigation is not stopped. In the future this parameter can be removed if Angular fixes
     * this router navigation issue
     */
    saveRow(item: T, doPublish?: boolean): void;
    applyFilter(filterFunc?: any): void;
    setItems(items: Array<T>, filterFunc?: any): void;
    isNewItem(): boolean;
}

export class RowManagementDelegate<T> implements IRowManagementDelegate<T> {
    public itemDataIDPropertyName: string;

    private _itemName: string;

    private _itemFactory: IItemFactory<T>;

    private _dataManager: IBaseDataManager<T>;

    constructor({
        itemName,
        itemIDPropertyName,
        itemFactory,
        dataManager
    }: {
        itemName: string;
        itemIDPropertyName: string;
        itemFactory: BaseItemFactory<T, any>;
        dataManager: BaseDataManager<T>;
    }) {
        this._itemName = itemName;
        this.itemDataIDPropertyName = itemIDPropertyName;
        this._itemFactory = itemFactory;
        this._dataManager = dataManager;
    }

    public initDataManager(items: Array<T>, filterFunc?: any): void {
        this._dataManager.initData(this._itemName, this.itemDataIDPropertyName, items, filterFunc);
    }

    public addNewRow(createItemParams: CreateItemParams<T>): T {
        const item: any = this._itemFactory.newInstance(createItemParams);
        this._dataManager.addItem(item);
        return item;
    }

    public deleteRow(item: T): void {
        this._dataManager.deleteItem(item);
    }

    public cancelRowChanges(item: T): void {
        this._dataManager.cancelItem(item);
    }

    public saveRow(item: T, doPublish: boolean = true): void {
        this._dataManager.saveItem(item, doPublish);
    }

    public applyFilter(filterFunc?: any): void {
        this._dataManager.applyNewFilter(filterFunc);
    }

    public setItems(items: Array<T>, filterFunc?: any): void {
        this._dataManager.setItems(items, filterFunc);
    }

    public isNewItem(): boolean {
        return this._dataManager.isNewItem();
    }
}
