import { Component, Injector, Type, ViewChild } from '@angular/core';

import { SplitPaneDialogViewModel } from 'life-core/component/layout/split';
import {
    DialogButton,
    DialogButtonType,
    CardDialog,
    CardDialogParams,
    CardDialogResult
} from 'life-core/component/dialog';
import { ResolvedDataNames } from 'life-core/view-model/data-resolver';
import { AuthorizationProvider } from 'life-core/authorization';
import { ButtonActionType } from 'life-core/component';

import { AppSession } from 'ls-core/session';

import { ScratchPadComponent } from './scratch-pad.component';
import { ScratchPadDataResolver } from './scratch-pad-data.resolver';
import { I18n } from 'life-core/i18n';
import { CaseAuthorizationProvider } from '../shared/authorization';

@Component({
    selector: 'scratchpad-dialog',
    templateUrl: './scratch-pad-dialog.component.html',
    providers: [{ provide: AuthorizationProvider, useClass: CaseAuthorizationProvider }]
})
export class ScratchPadDialogComponent extends SplitPaneDialogViewModel {
    public view: Type<ScratchPadComponent> = ScratchPadComponent;

    protected i18n: I18n;

    private _caseNumber: string;

    @ViewChild(CardDialog)
    protected cardDialog: CardDialog;

    constructor(injector: Injector, appSession: AppSession, i18n: I18n) {
        super(injector);
        this._caseNumber = appSession.policyDTO.PolicyNumber;
        this.i18n = i18n;
    }

    protected getDialogParams(): CardDialogParams {
        return {
            title: this.i18n(
                { value: 'Scratch Pad - {{caseNumber}}', id: 'component.scratchpad.title' },
                { caseNumber: this._caseNumber.toString() }
            ),
            resolve: [{ resolveName: ResolvedDataNames.data, resolverClass: ScratchPadDataResolver }],
            buttons: [
                new DialogButton({
                    type: DialogButtonType.OK,
                    actionType: ButtonActionType.DataChange,
                    handler: (dialogResult: CardDialogResult) => {
                        this.onCardDialogButtonClick(dialogResult);
                    }
                }),
                new DialogButton({
                    type: DialogButtonType.CANCEL,
                    handler: (dialogResult: CardDialogResult) => {
                        this.onCardDialogButtonClick(dialogResult);
                    }
                })
            ]
        };
    }

    // State Management

    protected getStateValueKey(): string {
        return 'scratch_pad_dialog';
    }
}
