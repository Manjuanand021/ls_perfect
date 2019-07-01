import { IItem } from '../model/item';

export class ItemEventData<TItemData = any> {
    public item: IItem<TItemData>;

    public callback: (result: boolean) => void;

    constructor(item: IItem<TItemData>, callback: (result: boolean) => void) {
        this.item = item;
        this.callback = callback;
    }
}

export class CreateItemEventData<TItemData = any> {
    public item: IItem<TItemData>;

    public callback: (result: IItem<TItemData>) => void;

    constructor(item: IItem<TItemData>, callback: (result: IItem<TItemData>) => void) {
        this.item = item;
        this.callback = callback;
    }
}
