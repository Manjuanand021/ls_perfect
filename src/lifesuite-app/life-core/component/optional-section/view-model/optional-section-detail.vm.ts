import { Injector } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';

export abstract class OptionalSectionDetailViewModel extends ViewModel implements ICompose {
    constructor(injector: Injector) {
        super(injector);
    }

    public setModel(model: any): void {
        this.data = model;
    }
}
