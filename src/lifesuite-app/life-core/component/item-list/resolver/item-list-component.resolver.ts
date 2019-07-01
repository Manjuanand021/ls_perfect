import { Type } from '@angular/core';

import { ItemComponentMap } from 'life-core/util/component-resolver';
import { IItem } from '../model/item';
import { ItemComponentResolver, IItemComponentResolver } from 'life-core/component/shared';

export interface IItemListComponentResolver<TItemData> extends IItemComponentResolver<IItem<TItemData>> {}

export class ItemListComponentResolver<TItemData> extends ItemComponentResolver<IItem<TItemData>>
    implements IItemListComponentResolver<TItemData> {
    constructor({
        itemComponents,
        resolverField,
        editModeOnly
    }: {
        itemComponents: Type<any> | ItemComponentMap;
        resolverField?: string;
        editModeOnly?: boolean;
    }) {
        super({
            itemComponents,
            resolverField,
            editModeOnly
        });
    }
}
