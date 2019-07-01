import { Component, ViewChild, Injector, Type } from '@angular/core';

import { I18n } from 'life-core/i18n';

import { SplitPaneDialogViewModel } from 'life-core/component/layout/split';
import {
    CardDialog,
    CardDialogParams,
    DialogResult,
    DialogButton,
    DialogButtonType,
    ButtonActionType
} from 'life-core/component';
import { ResolvedDataNames, ViewValidationResult } from 'life-core/view-model';
import { PolicyDTO, NoteDTO } from 'ls-core/model';
import { SavePolicyDataDelegate } from 'ls-core/service';
import { AppSession, PolicySubscriber } from 'ls-core/session';

import { AddUWNoteComponent } from './add-uw-note.component';
import { NotesMetaDataResolver } from 'business/policy/note/notes-meta-data.resolver';
import { NotesDataResolver } from 'business/policy/note/notes-data.resolver';
import { AuthorizationProvider } from 'life-core/authorization';
import { AddUWNotesAuthorizationProvider } from './add-uw-notes-authorization.provider';

@Component({
    selector: 'add-uw-note-dialog',
    template: `
        <card-dialog [view]="view" (dialogDismiss)="onDialogDismiss($event)" secureComponent></card-dialog>
    `,
    providers: [{ provide: AuthorizationProvider, useClass: AddUWNotesAuthorizationProvider }, PolicySubscriber]
})
export class AddUWNoteDialog extends SplitPaneDialogViewModel {
    public view: Type<AddUWNoteComponent> = AddUWNoteComponent;
    protected policy: PolicyDTO;

    @ViewChild(CardDialog)
    protected cardDialog: CardDialog;

    constructor(injector: Injector, i18n: I18n, policySubscriber: PolicySubscriber) {
        super(injector);
        this.i18n = i18n;
        policySubscriber.subscribe(this, policy => {
            this.policy = policy;
        });
    }

    protected getDialogParams(): CardDialogParams {
        return {
            title: this.i18n({ value: 'Add U/W Note', id: 'policy.notes.addnotes.uwnote.title' }),
            buttons: [
                new DialogButton({
                    type: DialogButtonType.ACCEPT,
                    actionType: ButtonActionType.DataChange,
                    handler: dialogResult => {
                        this.validate().then(validationResult => {
                            if (validationResult == ViewValidationResult.pass) {
                                this.onCardDialogOkClick(dialogResult);
                            }
                        });
                    }
                }),
                new DialogButton({
                    type: DialogButtonType.CANCEL,
                    actionType: ButtonActionType.Presentation,
                    handler: dialogResult => {
                        this.onCardDialogButtonClick(dialogResult);
                    }
                })
            ],
            data: this.splitArea.context,
            resolve: [
                { resolveName: ResolvedDataNames.metaData, resolverClass: NotesMetaDataResolver },
                { resolveName: ResolvedDataNames.data, resolverClass: NotesDataResolver }
            ]
        };
    }

    protected onCardDialogOkClick(dialogResult: DialogResult): void {
        this.addNoteToPolicy(dialogResult.returnValue);
        this.saveData();
        this.onCardDialogButtonClick(dialogResult);
    }

    private addNoteToPolicy(newNote: NoteDTO): void {
        this.policy.Notes_LazyLoad.push(newNote);
    }

    // State Management
    protected getStateValueKey(): string {
        return 'uw_notes_dialog';
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }

    protected getDataToSave(): any {
        return this.policy;
    }
}
