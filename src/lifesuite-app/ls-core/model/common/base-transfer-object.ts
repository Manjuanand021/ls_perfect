export class BaseTransferObject {
    private _uid: string;

    constructor() {
        // this._uid = LifeUIDUtil.createUID();
    }

    public get uid(): string {
        return this._uid;
    }

    public toString(): string {
        return `${this.constructor.name}:${this.uid}`;
    }
}
