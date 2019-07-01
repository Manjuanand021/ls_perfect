import { Injector, Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { DataSavingFlags, DeleteObjectAction } from 'life-core/reducer/actions';

export interface IBaseDataManager<T = any> {
    initData(itemName: string, idProperty: string, items: Array<T>, filterFunc?: any): void;

    getItems(): Observable<Array<T>>;

    getSelectedItem(): Observable<T>;

    setSelectedItem(item: T): void;

    applyNewFilter(filterFunc?: any): void;

    saveItem(item: T, doPublish?: boolean): void;

    addItem(item: T): void;

    deleteItem(item: T): void;

    cancelItem(item: T): void;

    setItems(items: Array<T>, filterFunc?: any): void;

    isNewItem(): boolean;
}

@Injectable()
export class BaseDataManager<T = any> implements IBaseDataManager<T> {
    protected originalItems: Array<T>;
    protected filteredItems: Array<T>;
    protected item: T;
    protected itemName: string;
    private _idProperty: string;
    private _itemSubject: Subject<T>;
    private _itemListSubject: BehaviorSubject<Array<T>>;
    private _isItemNew: boolean;
    private _filterFunction: any;
    private _store: Store<any>;

    constructor(injector: Injector) {
        this._itemSubject = new Subject<T>();
        this._isItemNew = false;
        this._store = injector.get(Store);
    }

    public initData(itemName: string, idProperty: string, items: Array<T>, filterFunc?: any): void {
        this.itemName = itemName;
        this._idProperty = idProperty;
        this.internalSetItems(items);
        this._filterFunction = filterFunc;
        this.iniializeData();
    }

    private internalSetItems(items: Array<T>): void {
        this.originalItems = items ? items : new Array<any>();
    }
    protected iniializeData(): void {
        this.applyFilter();
        this._itemListSubject = new BehaviorSubject<Array<T>>(this.filteredItems);
    }
    public getItems(): Observable<Array<T>> {
        return this._itemListSubject.asObservable();
    }

    public getSelectedItem(): Observable<T> {
        return this._itemSubject.asObservable();
    }

    public setSelectedItem(selectedItem: T): void {
        if (selectedItem == null) {
            this.item = null;
            this.publishItem();
            return;
        }
        let itemSelected: T;
        this.filteredItems.forEach(item => {
            if (item[this._idProperty] == selectedItem[this._idProperty]) {
                itemSelected = item;
            }
        });
        if (itemSelected != null) {
            this.item = itemSelected;
            this.publishItem();
        }
        this._isItemNew = false;
    }
    private publishItem(): void {
        this._itemSubject.next(this.item == null ? null : Object.assign({}, this.item));
    }
    private publishItemList(): void {
        this._itemListSubject.next(this.filteredItems);
    }

    public applyNewFilter(filterFunc?: any): void {
        if (filterFunc) {
            this._filterFunction = filterFunc;
        }
        this.applyFilterAndPublish();
    }

    public isNewItem(): boolean {
        return this._isItemNew;
    }

    private applyFilterAndPublish(doPublish: boolean = true): void {
        this.applyFilter();
        if (doPublish) {
            this.publishItemList();
        }
    }

    private applyFilter(): void {
        this.filteredItems = this.originalItems.filter(item => {
            return this._filterFunction ? this._filterFunction(item) : true;
        });
    }
    public saveItem(selectedItem: T, doPublish?: boolean): void {
        if (!selectedItem) return;
        this.originalItems.forEach(item => {
            if (item[this._idProperty] == selectedItem[this._idProperty]) {
                Object.assign(item, selectedItem);
            }
        });
        this.applyFilterAndPublish(doPublish);
        if (this.item && this.item[this._idProperty] == selectedItem[this._idProperty]) {
            Object.assign(this.item, selectedItem);
            if (doPublish) {
                this.publishItem();
            }
        }
        this._isItemNew = false;
    }

    public addItem(item: T): void {
        if (!item) return;
        this.originalItems.splice(0, 0, item);
        this.item = item;
        this._isItemNew = true;
        this.applyFilterAndPublish();
        this.publishItem();
        this.setDirtyFlag();
    }
    private setDirtyFlag(): void {
        this._store.dispatch({ type: DataSavingFlags.DATA_DIRTY, payload: true });
    }

    private deleteObject(object: any): void {
        if (object.identifier) {
            this._store.dispatch({ type: DeleteObjectAction.DELETE_OBJECT, payload: object.identifier });
        }
    }
    public deleteItem(selectedItem: T): void {
        if (!selectedItem) {
            return;
        }
        const itemId = selectedItem[this._idProperty];
        const index = this.findIndexOfItem(itemId);
        if (index >= 0) {
            this.originalItems.splice(index, 1);
            if (this.item[this._idProperty] == itemId) {
                this.item = null;
                this.publishItem();
            }
            this.applyFilterAndPublish();
            this.setDirtyFlag();
            this.deleteObject(selectedItem);
        } else {
            // item not found. need to throw exception
        }
        this._isItemNew = false;
    }
    private findIndexOfItem(itemId: any): number {
        for (let i = 0; i < this.originalItems.length; i++) {
            if (this.originalItems[i][this._idProperty] == itemId) return i;
        }
        return -1;
    }

    public cancelItem(item: T): void {
        if (this._isItemNew) {
            this.deleteItem(this.item);
        }
        this._isItemNew = false;
        this.publishItem();
    }

    public setItems(items: Array<T>, filterFunc?: any): void {
        this.internalSetItems(items);
        if (filterFunc) {
            this._filterFunction = filterFunc;
        }
        this.resetData();
    }

    private resetData(): void {
        this.item = null;
        this.publishItem();
        this.applyFilterAndPublish();
    }
}
