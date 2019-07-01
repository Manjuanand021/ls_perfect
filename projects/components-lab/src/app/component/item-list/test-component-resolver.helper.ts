import { Type } from '@angular/core';

import { IItemListComponentResolver, ItemOpenMode, ItemListComponentResolver } from 'life-core/component';
import { ItemComponentMap } from 'life-core/util';
import { ItemA } from './item-type/item-a';
import { ItemAEditor } from './item-type/item-a-editor';
import { ItemB } from './item-type/item-b';
import { ItemBEditor } from './item-type/item-b-editor';
import { ItemData } from './item-data';

export class TestComponentResolverHerlper {
    public getResolver(): IItemListComponentResolver<ItemData> {
        return new ItemListComponentResolver({
            itemComponents: this.getItemViewModelTypeResolverMap(),
            resolverField: 'data.type'
        });
    }

    getItemViewModelTypeResolverMap(): ItemComponentMap {
        const componentMap = new Map<string, Type<any>>();
        componentMap.set(ItemListComponentResolver.getItemCompositeKey('typeA', ItemOpenMode.View), ItemA);
        componentMap.set(ItemListComponentResolver.getItemCompositeKey('typeA', ItemOpenMode.Edit), ItemAEditor);
        componentMap.set(ItemListComponentResolver.getItemCompositeKey('typeB', ItemOpenMode.View), ItemB);
        componentMap.set(ItemListComponentResolver.getItemCompositeKey('typeB', ItemOpenMode.Edit), ItemBEditor);
        // If all items are of the same type, add one map entry as below
        // viewMap.add(MAP_DEFAULT_KEY, 'tests/item-list/item-type/item');
        return componentMap;
    }
}
