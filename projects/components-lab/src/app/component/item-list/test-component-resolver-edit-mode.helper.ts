import { Type } from '@angular/core';

import { IItemListComponentResolver, ItemListComponentResolver } from 'life-core/component';
import { ItemComponentMap } from 'life-core/util';
import { ItemAEditor } from './item-type/item-a-editor';
import { ItemBEditor } from './item-type/item-b-editor';
import { ItemData } from './item-data';

export class TestComponentResolverEditModeHerlper {
    public getResolver(editModeOnly: boolean): IItemListComponentResolver<ItemData> {
        return new ItemListComponentResolver({
            itemComponents: this.getItemViewModelTypeResolverMap(),
            resolverField: 'data.type',
            editModeOnly: editModeOnly
        });
    }

    getItemViewModelTypeResolverMap(): ItemComponentMap {
        const componentMap = new Map<string, Type<any>>();
        componentMap.set('typeA', ItemAEditor);
        componentMap.set('typeB', ItemBEditor);
        // If all items are of the same type, add one map entry as below
        // viewMap.add(MAP_DEFAULT_KEY, 'tests/item-list/item-type/item');
        return componentMap;
    }
}
