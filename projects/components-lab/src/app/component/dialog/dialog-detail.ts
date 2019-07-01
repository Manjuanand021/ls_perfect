import { Component, Injector, Injectable, Input } from '@angular/core';

import { ViewModel, ParentChildRegistry } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';
import { IDialogViewModel, DialogData, DialogButtonType, DialogViewModelResult } from 'life-core/component/dialog';

export abstract class DialogDetail extends ViewModel implements ICompose, IDialogViewModel {
    stringList: Array<{ label: string; value: string }> = [
        { label: 'Item 1', value: '1' },
        { label: 'Item 2', value: '2' },
        { label: 'Item 3', value: '3' },
        { label: 'Item 4', value: '4' },
        { label: 'Item 5', value: '5' },
        { label: 'Item 6', value: '6' },
        { label: 'Item 7', value: '7' },
        { label: 'Item 8', value: '8' },
        { label: 'Item 9', value: '9' },
        { label: 'Item 10', value: '10' },
        { label: 'Item 11', value: '11' },
        { label: 'Item 12', value: '12' }
    ];

    @Input() data: DialogData;

    public resolvedData: any;

    constructor(injector: Injector) {
        super(injector);
    }

    public setModel(model: DialogData) {
        this.data = model.parameterData;
        this.resolvedData = model.resolvedData;
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        return Promise.resolve(
            buttonId == DialogButtonType.OK
                ? new DialogViewModelResult("Dialog's return value on OK")
                : new DialogViewModelResult("Dialog's return value on CANCEL")
        );
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        console.debug('Dialog component: ngOnDestroy()');
    }
}

@Component({
    selector: 'modal-dialog-detail',
    template: `
        <form ngForm #form="ngForm">
            <div>
                <div>Dialog Editor</div>
                <div>Parameter data: <input name="input1" [(ngModel)]="data" style="width: 300px;" /></div>
                <div>
                    Resolved data: <input name="input2" [(ngModel)]="resolvedData.metadataData" style="width: 50%;" />
                </div>
                <lf-select name="dropdownField" [items]="stringList" style="width: 200px" container="dialog">
                </lf-select>
                <lf-form-input [control]="dateField" label="Date">
                    <lf-inputdate #dateField name="dateField" container="dialog"></lf-inputdate>
                </lf-form-input>
                <div style="overflow-y :hidden;"><div style="height: 30px; background-color: lightblue"></div></div>
            </div>
        </form>
    `,
    providers: [ParentChildRegistry]
})
@Injectable()
export class ModalDialogDetail extends DialogDetail {
    constructor(injector: Injector) {
        super(injector);
    }
}

@Component({
    selector: 'popover-dialog-detail',
    template: `
        <form ngForm #form="ngForm">
            <div>
                <div>Dialog Editor</div>
                <div>Parameter data: <input name="input1" [(ngModel)]="data" style="width: 300px;" /></div>
                <div>
                    Resolved data: <input name="input2" [(ngModel)]="resolvedData.metadataData" style="width: 50%;" />
                </div>
                <lf-select name="dropdownField" [items]="stringList" style="width: 200px"> </lf-select>
                <lf-inputdate name="dateField"></lf-inputdate>
                <div style="overflow-y :hidden;"><div style="height: 30px; background-color: lightblue"></div></div>
            </div>
        </form>
    `,
    providers: [ParentChildRegistry]
})
@Injectable()
export class PopoverDialogDetail extends DialogDetail {
    constructor(injector: Injector) {
        super(injector);
    }
}
