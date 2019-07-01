const Delimeter = '-';

export class CompositeTabId {
    public tabName: string;

    public objectId?: any;

    constructor(tabName: string, objectId?: any) {
        this.tabName = tabName;
        this.objectId = objectId;
    }

    public toString(): string {
        return this.objectId ? `${this.tabName}${Delimeter}${this.objectId}` : this.tabName;
    }

    public equalTo(value: CompositeTabId): boolean {
        return this.tabName == value.tabName && this.objectId == value.objectId;
    }

    public static getTabName(compositeId: string): string {
        const parts = compositeId.split(Delimeter);
        return parts.length > 0 ? parts[0] : '';
    }

    public static getObjectId(compositeId: string): any {
        const parts = compositeId.split(Delimeter);
        return parts.length > 1 ? parts[1] : '';
    }
}
