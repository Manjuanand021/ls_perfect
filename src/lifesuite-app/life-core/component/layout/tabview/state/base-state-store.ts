/**
 * Base class to maintain different states inside TabView component.
 */
export abstract class BaseStateStore<TData, TKey> {
    /**
     * Maps TabIds to TabStates.
     */
    protected store: Map<string, TData>;

    constructor() {
        this.store = new Map<string, TData>();
    }

    protected hasState(key: TKey): boolean {
        return this.store.has(this.keyToString(key));
    }

    protected createState(key: TKey): void {
        if (!this.hasState(key)) {
            this.store.set(this.keyToString(key), this.newStateData());
        }
    }

    protected setState(key: TKey, value: TData): void {
        this.store.set(this.keyToString(key), value);
    }

    protected getState(key: TKey): TData {
        return this.hasState(key) ? this.store.get(this.keyToString(key)) : null;
    }

    protected deleteState(key: TKey): void {
        this.store.delete(this.keyToString(key));
    }

    public deleteAll(): void {
        this.store.clear();
    }

    protected abstract keyToString(key: TKey): string;

    protected abstract newStateData(): TData;
}
