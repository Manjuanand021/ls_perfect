import { Type } from '@angular/core';

import { ItemComponentMap } from 'life-core/util/component-resolver';
import { ItemComponentResolver } from 'life-core/component/shared';

export class MasterDetailComponentResolver<T = any> extends ItemComponentResolver<T> {
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
