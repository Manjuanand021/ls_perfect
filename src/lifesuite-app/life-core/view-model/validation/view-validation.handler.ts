import { Injectable } from '@angular/core';

import { IActionHandler } from 'life-core/handler';
import { IViewModel } from '../view-model';
import { ValidationRenderType } from './view-validation.model';

@Injectable({
    providedIn: 'root'
})
export class ViewValidationHandler implements IActionHandler {
    public execute(actionParams: ViewValidationHandlerParams): void {
        actionParams.context.validate(ValidationRenderType.allways);
    }
}

export class ViewValidationHandlerParams {
    public context: IViewModel;

    constructor(context: IViewModel) {
        this.context = context;
    }
}
