import { Component, Injector, Type } from '@angular/core';

import { ItemViewModel } from 'life-core/component/item-list';
import { IComponentResolver, ComponentResolver, ComponentMap } from 'life-core/util';
import { ItemListAnimations } from 'life-core/component/item-list/animations/animations';

import { AgentPersonComponent } from './type';
import { PartyTypes, AgentDTO } from 'ls-core/model';

@Component({
    selector: 'agent-info',
    templateUrl: './agent-info.component.html',
    animations: ItemListAnimations
})
export class AgentInfoComponent extends ItemViewModel<AgentDTO> {
    public itemComponentType: Type<any>;

    private _componentMapResolver: IComponentResolver<string>;

    constructor(injector: Injector) {
        super(injector);
        this._componentMapResolver = this.getComponentMapResolver();
    }

    public setModel(model: any): any {
        super.setModel(model);
    }

    public loadData(): Promise<void> {
        this.setResolvedListData();
        this.setItemComponentType(this.item.data.PersonTypeId);
        return Promise.resolve();
    }

    private getComponentMapResolver(): IComponentResolver<string> {
        const componentMap: ComponentMap = new ComponentMap();
        componentMap.add(PartyTypes.PERSON, AgentPersonComponent);
        return new ComponentResolver<string>(componentMap);
    }

    private setItemComponentType(type: string): void {
        this.itemComponentType = this._componentMapResolver.resolve(type);
    }
}
