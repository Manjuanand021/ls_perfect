import { Injectable, Injector, Input } from '@angular/core';

import { EditorViewModel } from 'lpla-core/view-model';
import { IItem } from 'life-core/component/item-list';
import { ICompose } from 'life-core/component';

@Injectable()
export abstract class ItemEditorViewModel extends EditorViewModel implements ICompose {
    public item: IItem<any>;

    @Input()
    itemValidCssClass: string;

    constructor(container: Injector) {
        super(container);
    }

    public setModel(model: any) {
        this.item = model;
        this.data = this.item.data;
    }

    public saveData(): Promise<any> {
        return super.saveData().then(dataResponse => {
            if (dataResponse) {
                this.item.data = null;
                this.item.data = this.getItemDataFromSaveResult(dataResponse.data);
            }
        });
    }

    protected abstract getItemDataFromSaveResult(saveResult: any): any;

    protected isTopLevelView(): boolean {
        return false;
    }
}
