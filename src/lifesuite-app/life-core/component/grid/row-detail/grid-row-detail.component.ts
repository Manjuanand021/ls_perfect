import { Component } from '@angular/core';

import { ICompose } from 'life-core/component/compose';
import { IDialogViewModel, DialogViewModelResult, DialogButtonType, DialogData } from 'life-core/component/dialog';
import { GridRowDetailModel } from './grid-row-detail.model';

@Component({
    selector: 'grid-row-detail',
    templateUrl: 'grid-row-detail.component.html'
})
export class GridRowDetailComponent implements ICompose, IDialogViewModel {
    public rowDetail: GridRowDetailModel;

    constructor() {}

    public setModel(model: DialogData): void {
        this.rowDetail = model.parameterData;
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.OK) {
            return Promise.resolve(new DialogViewModelResult(true, true, false));
        }
    }
}
