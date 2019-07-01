/**
 *  Abstract class to manage various application resources,
 *  such as list metadata, dynamic form fields metadata, etc.
 */
export abstract class CacheManager<T> {
    private _data: Map<string, T>;

    private _loadingData: Map<string, Promise<any>>;

    constructor() {
        this._data = new Map<string, T>();
        this._loadingData = new Map<string, Promise<any>>();
    }

    public hasLocaleData(localeId: string): boolean {
        return this._data.has(localeId);
    }

    protected getValueImpl(key: string): Promise<CacheItem<T>> {
        return this.getValuesImpl([key]).then(response => response[0]);
    }

    protected getValuesImpl(keys: Array<string>): Promise<Array<CacheItem<T>>> {
        const result: Array<CacheItem<T>> = [];
        const keysToLoad: Array<string> = [];
        for (const key of keys) {
            if (this._data.has(key)) {
                result.push(this.createCacheItem(key, this._data.get(key)));
            } else {
                keysToLoad.push(key);
            }
        }
        if (keysToLoad.length > 0) {
            const loadingKey = keys.join();
            if (this._loadingData.has(loadingKey)) {
                return this._loadingData.get(loadingKey);
            } else {
                const returnPromise = this.loadValues(keysToLoad).then(values => {
                    this._loadingData.delete(loadingKey);
                    for (let i = 0; i < keysToLoad.length; i++) {
                        result.push(this.createCacheItem(keysToLoad[i], values[i]));
                        this.setValue(keysToLoad[i], values[i]);
                    }
                    return result;
                });
                this._loadingData.set(loadingKey, returnPromise);
                return returnPromise;
            }
        } else {
            return Promise.resolve(result);
        }
    }

    protected createCacheItem(key: string, value: T): CacheItem<T> {
        return new CacheItem<T>(key, value);
    }

    protected abstract loadValues(keys: Array<string>): Promise<T[]>;

    public setValue(key: string, value: any): void {
        this._data.set(key, value);
    }

    public destroy(): void {
        this._data.clear();
    }
}

export class CacheItem<T> {
    public key: string;
    public value: T;

    constructor(key: string, value: T) {
        this.key = key;
        this.value = value;
    }
}
