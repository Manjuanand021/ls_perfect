import { Type } from '@angular/core';

import { IItemListComponentResolver, ItemListComponentResolver } from 'life-core/component';
import { ItemComponentMap } from 'life-core/util/component-resolver';
import { PartyTypes, OwnerDTO } from 'ls-core/model';
import { OwnerInfoComponent } from './owner-info.component';

export class OwnerComponentResolverHelper {
    public getResolver(editModeOnly: boolean): IItemListComponentResolver<OwnerDTO> {
        return new ItemListComponentResolver({
            itemComponents: this.getItemViewModelTypeResolverMap(),
            resolverField: 'data.PersonTypeId',
            editModeOnly: editModeOnly
        });
    }

    private getItemViewModelTypeResolverMap(): ItemComponentMap {
        const componentMap: ItemComponentMap = new Map<string, Type<any>>();
        componentMap.set(PartyTypes.COMPANY, OwnerInfoComponent);
        componentMap.set(PartyTypes.ESTATE, OwnerInfoComponent);
        componentMap.set(PartyTypes.PARTNERSHIP, OwnerInfoComponent);
        componentMap.set(PartyTypes.PERSON, OwnerInfoComponent);
        componentMap.set(PartyTypes.TRUST, OwnerInfoComponent);
        return componentMap;
    }
}
