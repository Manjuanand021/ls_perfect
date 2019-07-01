import { Type } from '@angular/core';

import { IItemListComponentResolver, ItemListComponentResolver } from 'life-core/component';
import { ItemComponentMap } from 'life-core/util/component-resolver';

import { BenefitDTO } from 'ls-core/model';

import { BenefitInfoComponent } from './benefit-info.component';

export class BenefitComponentResolver {
    public getResolver(editModeOnly: boolean): IItemListComponentResolver<BenefitDTO> {
        return new ItemListComponentResolver({
            itemComponents: this.getItemViewModelTypeResolverMap(),
            resolverField: null,
            editModeOnly: editModeOnly
        });
    }

    private getItemViewModelTypeResolverMap(): ItemComponentMap {
        const componentMap: ItemComponentMap = new Map<string, Type<any>>();
        componentMap.set('', BenefitInfoComponent);
        return componentMap;
    }
}
