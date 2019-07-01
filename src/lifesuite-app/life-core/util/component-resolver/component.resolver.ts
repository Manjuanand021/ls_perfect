import { Type } from '@angular/core';

export const MAP_DEFAULT_KEY = '';
export const MAP_KEY_DELIMITER = ':';

export type ItemComponentMap = Map<string, Type<any>>;

export interface IComponentResolver<T> {
    resolve(resolveBy: T): Type<any>;
}

export class ComponentResolver<T> implements IComponentResolver<T> {
    private _componentMap: ComponentMap;

    constructor(componentMap?: ComponentMap) {
        this._componentMap = componentMap;
    }

    public resolve(resolveBy: T): Type<any> {
        return this._componentMap != null ? this._componentMap.get(resolveBy) : null;
    }
}

export class ComponentMap {
    private _componentMap: { [key: string]: Type<any> } = {};

    public add(key: any, value: Type<any>): void {
        this._componentMap[this.keyToString(key)] = value;
    }

    public get(key: any): Type<any> {
        return this._componentMap[this.keyToString(key)];
    }

    public keyToString(key: any): string {
        if (typeof key == 'string' || key instanceof String) {
            return key.toString();
        } else if (key) {
            return key.toString();
        } else {
            return MAP_DEFAULT_KEY;
        }
    }
}
