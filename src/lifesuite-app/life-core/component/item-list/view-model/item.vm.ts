import { Injector } from '@angular/core';

import { IItem } from '../model/item';
import { ViewModel } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';

export abstract class ItemViewModel<TItemData> extends ViewModel<TItemData> implements ICompose {
    public item: IItem<TItemData>;

    constructor(container: Injector) {
        super(container);
    }

    public setModel(model: any): void {
        this.item = model;
        this.data = this.item.data;
    }

    public get index(): number {
        return this.item.index;
    }

    public get sequenceId(): number {
        return this.item.sequenceId;
    }

    protected needToSaveComponentsState(): boolean {
        return !this.item.deleted;
    }
}
