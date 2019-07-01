/**
 * NavigationTarget defines a single navigation step in auto-navigation sequence
 *
 */
export class NavigationTarget {
    public static PARAM_TARGET_ID: string = 'targetId';
    public static PARAM_PERSON_ID: string = 'personId';
    public static PARAM_COLLECTION_ITEM_ID: string = 'collectionItemId';

    private _navigatorId: string;
    private _targetType: string;
    private _params: Map<string, string>;

    constructor() {
        this._params = new Map();
    }

    /**
     * Id of the class implementing navigation step
     * described in this navigation target
     * @return class Id
     *
     */
    public get navigatorId(): string {
        return this._navigatorId;
    }

    public set navigatorId(value: string) {
        this._navigatorId = value;
    }

    /**
     * Type of the navigation target: Tab, SubTab, Popup, etc.
     * @return
     *
     */
    public get targetType(): string {
        return this._targetType;
    }

    public set targetType(value: string) {
        this._targetType = value;
    }

    /**
     * Adds parameter to the collection describing navigation target
     * @param key
     * @param value
     * @return boolean value indicating whether parameter was added successfully
     *
     */
    public addParam(key: any, value: any): boolean {
        if (key == null || value == null || this._params.has(key)) {
            return false;
        } else {
            this._params.set(key, value);
            return true;
        }
    }

    /**
     * Removes parameter from the collection describing navigation target
     * @param key
     * @return parameter being removed
     *
     */
    public removeParam(key: any): string {
        let value = '';
        if (this._params.has(key)) {
            value = this._params.get(key);
            this._params.delete(key);
        }
        return value;
    }

    /**
     * Retrieves parameter from the collection describing navigation target
     * @param key
     * @return parameter that corresponds to the provided key
     *
     */
    public getParam(key: any): string {
        let value = '';
        if (this._params.has(key)) {
            value = this._params.get(key);
        }
        return value;
    }
}

export enum NavigationTargetTypes {
    Tab = 'targetTypeTab',
    SubTab = 'targetTypeSubTab',
    Popup = 'targetTypePopup',
    CollectionItem = 'targetTypeCollectionItem',
    Route = 'targetTypeRoute'
}
