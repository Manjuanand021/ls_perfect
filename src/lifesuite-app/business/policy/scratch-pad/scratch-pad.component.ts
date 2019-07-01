import { Component, Injector } from '@angular/core';

import { ViewModel, ParentChildRegistry, ViewValidationResult } from 'life-core/view-model';
import { ICompose } from 'life-core/component/compose';
import { ICardDialogViewModel, DialogViewModelResult, DialogButtonType } from 'life-core/component/dialog';

import { ScratchPadDTO } from 'ls-core/model';

import { ScratchPadDataService } from './scratch-pad-data.service';

@Component({
    selector: 'scratchpad-component',
    templateUrl: './scratch-pad.component.html',
    providers: [ParentChildRegistry, ScratchPadDataService]
})
export class ScratchPadComponent extends ViewModel<ScratchPadDTO> implements ICompose, ICardDialogViewModel {
    private _scratchPadDataService: ScratchPadDataService;
    private _stateData: ScratchPadStateModel;

    constructor(injector: Injector, scratchPadDataService: ScratchPadDataService) {
        super(injector);
        this._scratchPadDataService = scratchPadDataService;
    }

    public setModel(model: any): void {
        Object.assign(this.data, { ...model.resolvedData.data });
        this.updateWithStateData();
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        if (buttonId == DialogButtonType.OK) {
            return this.validate().then(validationResult => {
                if (validationResult == ViewValidationResult.pass) {
                    this._scratchPadDataService.updateScratchPad(this.data);
                } else {
                    return Promise.resolve(new DialogViewModelResult(null, false, false));
                }
            });
        } else {
            return Promise.resolve(null);
        }
    }

    public initData(): void {}

    public getState(): any {
        const stateData = new ScratchPadStateModel();
        stateData.note = this.data.ScratchPadNote;
        return stateData;
    }

    public setState(stateData: any): void {
        this._stateData = stateData;
    }

    private updateWithStateData(): void {
        if (this._stateData) {
            this.data.ScratchPadNote = this._stateData.note;
        }
    }
}

class ScratchPadStateModel {
    public note: string;
}
