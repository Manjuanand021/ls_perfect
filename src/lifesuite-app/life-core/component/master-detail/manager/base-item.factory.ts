export interface IItemFactory<T> {
    newInstance(createItemParams: any): T;
}

export abstract class BaseItemFactory<TItem, TID> implements IItemFactory<TItem> {
    public newInstance(createItemParams: CreateItemParams<TItem>): TItem {
        return {} as TItem;
    }

    protected abstract getNextId(items: Array<TItem>, idProperty: string): TID;
}

export interface CreateItemParams<T> {
    items: T[];
}
