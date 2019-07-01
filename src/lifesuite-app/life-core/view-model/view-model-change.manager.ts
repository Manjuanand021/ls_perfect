import { Injectable } from '@angular/core';

/**
 * Interface for classes implementing ViewModel change tracking
 */
export interface IViewModelChangeManager {
    setIsDirty(isDirty: boolean): void;
    deleteObject(item: any): void;

    // This method is used to mark an object identifier as deleted when the real base object is reused for new property
    // the situation needed is when a payor is changed to Primary insured or other way around.
    // in this situation, the object is not actually deleted, but reused, however,
    // the old obect need to be removed from database, otherwise, we will have issue in backend
    markObjectAsDeletedByIdentifier(identifier: any): void;
    clearDirtyFlag(): void;
    isDirty(): boolean;
}

@Injectable({ providedIn: 'root' })
export class ViewModelChangeManager implements IViewModelChangeManager {
    public setIsDirty(isDirty: boolean): void {}
    public deleteObject(item: any): void {}
    public markObjectAsDeletedByIdentifier(identifier: any): void {}
    public clearDirtyFlag(): void {}
    public isDirty(): boolean {
        return false;
    }
}
