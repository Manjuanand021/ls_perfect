import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { ObjectUtil } from 'life-core/util/lang';

export interface ICancelableDataManager<T> {
    getItem(): Observable<T>;

    setItem(item: T): void;

    saveItem(item: T): void;

    cancelItem(item: T): void;
}

@Injectable()
export class CancelableDataManager<T = any> implements ICancelableDataManager<T>, OnDestroy {
    private _item: T;
    private _itemSubject: BehaviorSubject<T>;

    constructor() {}

    public getItem(): Observable<T> {
        return this._itemSubject.asObservable();
    }

    public setItem(item: T): void {
        this.init(item);
        this.publishItem();
    }

    private publishItem(): void {
        // this._itemSubject.next(this.item == null ? null : Object.assign({}, this.item));
        this._itemSubject.next(this._item == null ? null : ObjectUtil.deepCopy(this._item));
    }

    public saveItem(selectedItem: T): void {
        if (!selectedItem) return;
        Object.assign<T, T>(this._item, selectedItem);
        // this.item = selectedItem;
        this.publishItem();
    }

    public cancelItem(item: T): void {
        this.publishItem();
    }

    public ngOnDestroy(): void {
        this._itemSubject.complete();
        this._itemSubject = null;
        this._item = null;
    }

    private init(item: T): void {
        this._item = item;
        if (this._itemSubject) {
            this._itemSubject.complete();
        }
        this._itemSubject = new BehaviorSubject<T>(null);
    }
}
