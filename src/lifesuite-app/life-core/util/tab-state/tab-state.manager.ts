import { Injectable } from '@angular/core';
import { TabDescriptor } from 'life-core/component/layout/tabview';

@Injectable()
export class TabStateManager {
    private _data: Map<string, any> = new Map<string, any>();

    public initTabState(tabDescriptor: TabDescriptor): void {
        this._data = tabDescriptor.stateData;
    }

    public getKeyedValue(key: string): any {
        if (this._data.has(key)) {
            return this._data.get(key);
        }
        return null;
    }

    public setKeyedValue(key: string, value: any): void {
        this._data.set(key, value);
    }

    public deleteKeyedValue(key: string): boolean {
        if (this._data.has(key)) {
            return this._data.delete(key);
        }
        return false;
    }

    public isKeyValueSet(key: string): boolean {
        return this._data.has(key);
    }

    public destroy(): void {
        this._data.clear();
    }
}
