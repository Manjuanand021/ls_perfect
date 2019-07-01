import { Component, Injector, ViewChild, Type } from '@angular/core';

import {
    CardDialog,
    IDialogViewModel,
    DialogViewModelResult,
    DialogButton,
    DialogButtonType,
    CardDialogParams
} from 'life-core/component/dialog';
import { SplitPaneDialogViewModel } from 'life-core/component/layout/split';
import { ICompose } from 'life-core/component/compose';
import { ViewModel, ValidationRenderType, ViewValidationResult, ParentChildRegistry } from 'life-core/view-model';
import { SaveDataResult } from 'life-core/service';

// NOTE

@Component({
    selector: 'note-dialog',
    template: `
        <card-dialog [view]="view" (dialogDismiss)="onDialogDismiss($event)"></card-dialog>
    `
})
export class NoteDialog extends SplitPaneDialogViewModel {
    public view: Type<NoteComponent> = NoteComponent;

    @ViewChild(CardDialog)
    protected cardDialog: CardDialog;

    constructor(injector: Injector) {
        super(injector);
    }

    protected getDialogParams(): CardDialogParams {
        return {
            title: 'Notes',
            buttons: [
                new DialogButton({
                    type: DialogButtonType.OK,
                    handler: dialogResult => {
                        this.onCardDialogButtonClick(dialogResult);
                    }
                }),
                new DialogButton({
                    type: DialogButtonType.CANCEL,
                    handler: dialogResult => {
                        this.onCardDialogButtonClick(dialogResult);
                    }
                })
            ],
            data: this.splitArea.context
        };
    }

    // State Management
    protected getStateValueKey(): string {
        return NoteDialogStateValueKey;
    }
}

@Component({
    selector: 'note-component',
    template: `
        <form #form="ngForm" role="form" class="form" autocomplete="off">
            <div class="col">
                <lf-form-input [control]="textField" label="Field 1">
                    <lf-inputtext #textField name="textField" [(ngModel)]="data.text" required></lf-inputtext>
                </lf-form-input>                
                <lf-form-input [control]="dateField" label="Field 2">
                    <lf-inputdate #dateField name="dateField" [(ngModel)]="data.date"></lf-inputdate>
                </lf-form-input>                
            </div>
            <div class="col">
                <lf-form-input [control]="note" label="Note">
                    <lf-inputtextarea #note name="note" [(ngModel)]="data.note" rows="5" cols="40"></lf-inputtextarea>
                </lf-form-input>                
            </div>
        </form>
    `,
    providers: [ParentChildRegistry]
})
export class NoteComponent extends ViewModel implements ICompose, IDialogViewModel {
    public data: NoteDialogModel;

    constructor(injector: Injector) {
        super(injector);
    }

    public setModel(model: any): void {
        Object.assign(this.data, { ...model });
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.OK) {
            return this.validate(ValidationRenderType.never).then(validationResult => {
                if (validationResult == ViewValidationResult.pass) {
                    return this.saveData().then(saveResult => {
                        return new DialogViewModelResult(saveResult == SaveDataResult.success, true);
                    });
                } else {
                    return Promise.resolve(new DialogViewModelResult(null, false, false));
                }
            });
        }
        return Promise.resolve(null);
    }

    public initData(): void {
        this.data = new NoteDialogModel();
    }
}

// SCRATCH PAD

@Component({
    selector: 'scratch-pad-dialog',
    template: `
        <card-dialog [view]="view" (dialogDismiss)="onDialogDismiss($event)"></card-dialog>
    `
})
export class ScratchPadDialog extends SplitPaneDialogViewModel {
    public view: Type<ScratchPadComponent> = ScratchPadComponent;

    @ViewChild(CardDialog)
    protected cardDialog: CardDialog;

    constructor(injector: Injector) {
        super(injector);
    }

    protected getDialogParams(): CardDialogParams {
        return {
            title: 'Scratch Pad',
            buttons: [
                new DialogButton({
                    type: DialogButtonType.OK,
                    handler: dialogResult => {
                        this.onCardDialogButtonClick(dialogResult);
                    }
                }),
                new DialogButton({
                    type: DialogButtonType.CANCEL,
                    handler: dialogResult => {
                        this.onCardDialogButtonClick(dialogResult);
                    }
                })
            ],
            data: this.splitArea.context
        };
    }

    // State Management
    protected getStateValueKey(): string {
        return ScratchpadDialogStateValueKey;
    }
}

@Component({
    selector: 'scratchpad-component',
    template: `
        <form #form="ngForm" role="form" class="form" autocomplete="off">
            <div class="col">
                <lf-form-input [control]="pad" label="Scratchpad">
                    <lf-inputtextarea #pad name="pad" [(ngModel)]="data.text" rows="7" cols="40"></lf-inputtextarea>
                </lf-form-input> 
            </div>
        </form>
    `,
    providers: [ParentChildRegistry]
})
export class ScratchPadComponent extends ViewModel implements ICompose, IDialogViewModel {
    public data: ScratchpadModel;

    constructor(injector: Injector) {
        super(injector);
    }

    public setModel(model: any): void {
        Object.assign(this.data, { ...model });
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.OK) {
            return this.validate(ValidationRenderType.never).then(validationResult => {
                if (validationResult == ViewValidationResult.pass) {
                    return this.saveData().then(saveResult => {
                        const dialogResult =
                            saveResult == SaveDataResult.success || saveResult == SaveDataResult.noNeedToSave;
                        return Promise.resolve(new DialogViewModelResult(dialogResult, true));
                    });
                }
            });
        }
        return Promise.resolve(null);
    }

    public initData(): void {
        this.data = new ScratchpadModel();
    }
}

class NoteDialogModel {
    text: string;
    date: Date;
    note: string;
}
class ScratchpadModel {
    text: string;
}

const NoteDialogStateValueKey = 'noteDialogStateValueKey';
const ScratchpadDialogStateValueKey = 'scratchpadDialogStateValueKey';
