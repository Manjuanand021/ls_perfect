import { Injectable } from '@angular/core';

export interface ILocalStorage {
    getItem(key: string): any;
    setItem(key: string, data: any): void;
    removeItem(key: string): void;
    clear(): void;
}

@Injectable()
export class LocalStorage implements ILocalStorage {
    protected storage: Storage;

    constructor() {
        this.storage = this._getLocalStorage();
    }

    public getItem(key: string): any {
        return JSON.parse(this.storage.getItem(key));
    }

    public setItem(key: string, data: any): void {
        return this.storage.setItem(key, JSON.stringify(data));
    }

    public removeItem(key: string): void {
        return this.storage.removeItem(key);
    }

    public clear(): void {
        return this.storage.clear();
    }

    private _getLocalStorage(): Storage {
        if ('localStorage' in window && window.localStorage !== null) {
            return window.localStorage;
        }
        throw new Error('Local Storage is disabled or unavailable.');
    }
}
