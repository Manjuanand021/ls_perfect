import { Injector } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';
import { SaveDataResult } from 'life-core/service';

export abstract class DetailViewModel<TData> extends ViewModel<TData> implements ICompose {
    public data: TData;

    constructor(injector: Injector) {
        super(injector);
    }

    public setModel(model: TData): void {
        this.data = model;
    }

    // Save data in MasterDetail view model
    public saveData(): Promise<SaveDataResult> {
        return Promise.resolve(SaveDataResult.noNeedToSave);
    }
}
