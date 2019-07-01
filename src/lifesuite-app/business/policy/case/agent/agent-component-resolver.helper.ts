import { Type } from '@angular/core';

import { IItemListComponentResolver, ItemListComponentResolver } from 'life-core/component/item-list';
import { ItemComponentMap } from 'life-core/util/component-resolver';

import { PartyTypes, AgentDTO } from 'ls-core/model';

import { AgentInfoComponent } from './agent-info.component';

export class AgentComponentResolverHelper {
    public getResolver(editModeOnly: boolean): IItemListComponentResolver<AgentDTO> {
        return new ItemListComponentResolver({
            itemComponents: this.getItemViewModelTypeResolverMap(),
            resolverField: 'data.PersonTypeId',
            editModeOnly: editModeOnly
        });
    }

    private getItemViewModelTypeResolverMap(): ItemComponentMap {
        const componentMap: ItemComponentMap = new Map<string, Type<any>>();
        componentMap.set(PartyTypes.PERSON, AgentInfoComponent);
        return componentMap;
    }
}
