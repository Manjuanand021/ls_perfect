import { Component, Injector, Injectable, Input, EventEmitter } from '@angular/core';

import { ViewModel, ParentChildRegistry } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';
import {
    IDialogViewModel,
    IDialogResultEventEmitter,
    DialogData,
    DialogViewModelResult
} from 'life-core/component/dialog';

@Component({
    selector: 'dialog-detail',
    templateUrl: './create-requirement-detail.html',
    providers: [ParentChildRegistry]
})
@Injectable()
export class CreateRequirementDetail extends ViewModel
    implements ICompose, IDialogViewModel, IDialogResultEventEmitter {
    @Input() public data: any;

    public dialogResultEventEmitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(injector: Injector) {
        super(injector);
    }

    public setModel(model: DialogData): void {
        this.listData = model.parameterData;
    }

    public onRequirementChange(selectedRequirement: any): void {
        if (selectedRequirement.value) {
            this.dialogResultEventEmitter.emit(new DialogViewModelResult(selectedRequirement.value, true, true));
        }
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        return Promise.resolve(null);
    }
}
