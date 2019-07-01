import { Type } from '@angular/core';

import { ItemComponentMap, MAP_DEFAULT_KEY, MAP_KEY_DELIMITER } from 'life-core/util/component-resolver';

import { ItemOpenMode } from './item-open-mode.type';

export interface IItemComponentResolver<T> {
    resolve(item: T, openMode?: ItemOpenMode): Type<any>;
}

export abstract class ItemComponentResolver<T = any> implements IItemComponentResolver<T> {
    protected itemComponentMap: ItemComponentMap;

    protected resolverField: string;

    protected editModeOnly: boolean = false;

    /**
     * ItemComponentResolver constructor
     * @param itemComponents Type<any> or Map of Type<any>.
     * @param resolverField Resolver field or resolver path, such as someobject.somefield.
     * @param editModeOnly Create/Edit/View or always Edit mode.
     */
    constructor({
        itemComponents,
        resolverField,
        editModeOnly
    }: {
        itemComponents: Type<any> | ItemComponentMap;
        resolverField?: string;
        editModeOnly?: boolean;
    }) {
        this.resolverField = resolverField;
        this.initItemComponentMap(itemComponents);
        this.editModeOnly = editModeOnly;
    }

    protected initItemComponentMap(itemComponents: Type<any> | ItemComponentMap): void {
        if (itemComponents instanceof Map) {
            this.itemComponentMap = itemComponents;
        } else {
            this.itemComponentMap = new Map<string, Type<any>>();
            this.itemComponentMap.set(MAP_DEFAULT_KEY, itemComponents);
        }
    }

    public resolve(item: T, openMode?: ItemOpenMode): Type<any> {
        const itemKey = this.resolverField ? this.getResolverFieldValue(item) : null;
        const mapKey = this.getKey(itemKey, openMode);
        const resolvedType = this.itemComponentMap.get(mapKey);
        return resolvedType ? resolvedType : this.itemComponentMap.get(this.getKey(itemKey));
    }

    protected getResolverFieldValue(item: T): any {
        const resolverPath: string[] = this.resolverField.split('.');
        let data = item;
        while (resolverPath.length > 0) {
            data = data[resolverPath[0]];
            resolverPath.shift();
        }
        return data;
    }

    private getKey(itemKey: any, openMode?: ItemOpenMode): string {
        if (this.editModeOnly) {
            return itemKey ? itemKey.toString() : MAP_DEFAULT_KEY;
        }
        return ItemComponentResolver.getItemCompositeKey(itemKey, openMode);
    }

    public static getItemCompositeKey(itemKey: any, openMode?: ItemOpenMode): string {
        return itemKey
            ? openMode
                ? `${itemKey}${MAP_KEY_DELIMITER}${openMode}`
                : itemKey
            : openMode
            ? `${openMode}`
            : MAP_DEFAULT_KEY;
    }
}
