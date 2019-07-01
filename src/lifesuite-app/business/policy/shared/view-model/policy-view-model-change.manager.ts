import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { IViewModelChangeManager } from 'life-core/view-model';
import { AppState } from 'ls-core/model';
import { DataSavingFlags, DeleteObjectAction } from 'life-core/reducer/actions';

@Injectable()
export class PolicyViewModelChangeManager implements IViewModelChangeManager {
    private _store: Store<AppState>;

    constructor(store: Store<AppState>) {
        this._store = store;
    }

    public setIsDirty(isDirty: boolean): void {
        if (this.shouldUpdateDirtyFlag(isDirty)) {
            this._store.dispatch({ type: DataSavingFlags.DATA_DIRTY, payload: isDirty });
        }
    }
    public deleteObject(item: any): void {
        if (item.identifier && item.identifier.ObjectID) {
            this._store.dispatch({ type: DeleteObjectAction.DELETE_OBJECT, payload: item.identifier });
            this.setIsDirty(true);
        }
    }

    public markObjectAsDeletedByIdentifier(identifier: any): void {
        if (identifier.ObjectID) {
            this._store.dispatch({ type: DeleteObjectAction.DELETE_OBJECT, payload: identifier });
            this.setIsDirty(true);
        }
    }
    public clearDirtyFlag(): void {
        this._store.dispatch({ type: DataSavingFlags.DATA_DIRTY, payload: false });
    }
    public isDirty(): boolean {
        let dirty: boolean;
        this._store
            .select(state => state.isDirty)
            .subscribe(state => (dirty = state))
            .unsubscribe();
        return dirty;
    }
    private shouldUpdateDirtyFlag(isDirty: boolean): boolean {
        return !this.isDirty() && isDirty;
    }
}
