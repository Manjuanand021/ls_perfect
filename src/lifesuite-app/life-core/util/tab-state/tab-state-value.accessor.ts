import { TabStateManager } from './tab-state.manager';

export class TabStateValueAccessor<T> {
    private _tabStateManager: TabStateManager;
    private _key: string;

    constructor(tabStateManager: TabStateManager, key: string) {
        this._tabStateManager = tabStateManager;
        this._key = key;
    }

    public getValue(): T {
        return this._tabStateManager.getKeyedValue(this._key);
    }

    public setValue(value: T): void {
        this._tabStateManager.setKeyedValue(this._key, value);
    }

    public deleteValue(): boolean {
        return this._tabStateManager.deleteKeyedValue(this._key);
    }

    public hasValue(): boolean {
        return this._tabStateManager.isKeyValueSet(this._key);
    }
}
