import { Injectable } from '@angular/core';

import { ILocalStorage, LocalStorage } from 'life-core/storage/local-storage';

@Injectable()
export class StartupContextUtil {
    private _localStorage: ILocalStorage;

    constructor(localStorage: LocalStorage) {
        this._localStorage = localStorage;
    }

    public getItem(key: string): any {
        return this._localStorage.getItem(key);
    }

    public setItem(key: string, data: any): void {
        this._localStorage.setItem(key, data);
    }

    public removeItem(key: string): void {
        this._localStorage.removeItem(key);
    }
}
