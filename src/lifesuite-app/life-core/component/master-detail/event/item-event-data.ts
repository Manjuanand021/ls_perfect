export class ItemEventData {
    public item: any;

    public callback: (result: boolean) => void;

    constructor(item: any, callback: (result: boolean) => void) {
        this.item = item;
        this.callback = callback;
    }
}

export class CreateItemEventData {
    public item: any;

    public callback: (result: any) => void;

    constructor(item: any, callback: (result: any) => void) {
        this.item = item;
        this.callback = callback;
    }
}
