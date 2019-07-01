import { Injector, Injectable } from '@angular/core';
import { ViewModel } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';
import { IItem } from 'life-core/component/item-list';
import { ListDataUpdater } from 'ls-core/service';
import { AgentDTO } from 'ls-core/model';

@Injectable()
export class AgentTypeComponent extends ViewModel<AgentDTO> implements ICompose {
    public item: IItem<AgentDTO>;

    protected listDataUpdater: ListDataUpdater;

    constructor(injector: Injector) {
        super(injector);
        this.listDataUpdater = injector.get(ListDataUpdater);
    }

    public setModel(model: any) {
        this.item = model;
        this.data = this.item.data;
    }
}
