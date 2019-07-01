import { Injectable, Injector } from '@angular/core';

import { ViewModel } from 'life-core/view-model';
import { ViewValidationResult } from 'life-core/view-model';
import { DataService, DataResponse } from 'lpla-core/service';
import { ICompose } from 'life-core/component/compose';
import { QuestionData } from './question.model';

@Injectable()
export class QuestionDetail extends ViewModel implements ICompose {
    public data: QuestionData;

    constructor(container: Injector) {
        super(container);
    }

    public setModel(model: any) {
        this.data = model;
    }

    public canDeactivate(): Promise<boolean> {
        return this.validate().then(result => result == ViewValidationResult.pass);
    }

    protected isTopLevelView(): boolean {
        return false;
    }
}
