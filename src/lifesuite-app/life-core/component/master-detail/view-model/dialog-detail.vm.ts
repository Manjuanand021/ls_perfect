import { Injector } from '@angular/core';

import { IDialogViewModel, DialogData, DialogViewModelResult } from 'life-core/component/dialog';
import { DetailViewModel } from './detail.vm';
import { ViewValidationResult } from 'life-core/view-model';

export abstract class DialogDetailViewModel<TData> extends DetailViewModel<TData> implements IDialogViewModel {
    public resolvedData: any;

    constructor(injector: Injector) {
        super(injector);
    }

    public setModel(model: DialogData): void {
        this.data = model.parameterData as TData;
        this.resolvedData = model.resolvedData;
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (this.isDialogButtonTypeOK(buttonId)) {
            const isDirty = this.isDirty();
            return this.validate().then(result => {
                if (result == ViewValidationResult.pass) {
                    this.beforeDialogClose(buttonId);
                }
                return new DialogViewModelResult(null, result == ViewValidationResult.pass, isDirty);
            });
        } else {
            this.beforeDialogClose(buttonId);
            return Promise.resolve(null);
        }
    }

    protected beforeDialogClose(buttonId: string): void {}

    protected abstract isDialogButtonTypeOK(buttonType: string): boolean;
}
