import { Injector, Injectable, OnDestroy } from '@angular/core';

import { DataService, DataServiceParams, DataResponse } from 'lpla-core/service';
import { IItem } from 'life-core/component/item-list';
import { ItemEditorViewModel } from 'lpla-core/component/item-list';
import { ViewValidationResult } from 'life-core/view-model';

import { ItemData } from '../item-data';

@Injectable()
export class ItemEditor extends ItemEditorViewModel implements OnDestroy {
    data: ItemData;

    // Declaration to satisfy TypeScript compiler
    name: any;

    constructor(container: Injector) {
        super(container);
    }

    public get itemType() {
        return this.data.type;
    }

    canDeactivate(): Promise<boolean> {
        console.debug(this.itemType + ' canDeactivate');
        return super.canDeactivate();
    }

    ngOnDestroy() {
        console.debug(this.itemType + ' deactivate');
        return super.ngOnDestroy();
    }

    protected setupData(): void {
        console.debug(this.itemType + ' setupData');
    }

    public loadData(): Promise<void> {
        console.debug('LoadData');
        return new Promise<void>((accept, reject) => {
            setTimeout(() => {
                accept();
            }, 200);
        });
    }

    saveData(): Promise<void> {
        console.debug(this.itemType + ' saveData');
        return new Promise<void>((accept, reject) => {
            setTimeout(() => {
                accept();
            }, 200);
        });
    }

    public validate(): Promise<ViewValidationResult> {
        console.debug(this.itemType + ' Validate');
        //      return new Promise<boolean>((accept, reject) => {
        //	let isValid = this.name.value.length > 0;
        //	accept(isValid)
        //});
        return Promise.resolve(ViewValidationResult.pass);
    }

    protected getItemDataFromSaveResult(saveResult: any): any {
        return null;
    }
}
