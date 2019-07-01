import { Component, ViewChild, Injector, Type, inject } from '@angular/core';

import { SplitPaneDialogViewModel } from 'life-core/component/layout/split';
import {
    CardDialog,
    CardDialogParams,
    DialogResult,
    DialogButton,
    DialogButtonType,
    ButtonActionType
} from 'life-core/component';
import { AuthorizationProvider } from 'life-core/authorization';
import { ResolvedDataNames, ViewValidationResult } from 'life-core/view-model';
import { I18n } from 'life-core/i18n';

import { NoteDTO, PolicyDTO } from 'ls-core/model';
import { AppSession, PolicySubscriber } from 'ls-core/session';
import { SavePolicyDataDelegate } from 'ls-core/service';

import { AddCaseNoteComponent } from './add-case-note.component';
import { AddCaseNoteMetaDataResolver } from './add-case-note-meta-data.resolver';
import { AddCaseNoteListDataResolver } from './add-case-note-list-data.resolver';
import { AddCaseNoteDataResolver } from './add-case-note-data.resolver';
import { AddCaseNotesAuthorizationProvider } from './add-case-notes-authorization.provider';
import { RefreshPolicyHandler } from 'business/policy/shared/refresh-policy/refresh-policy.handler';

@Component({
    selector: 'add-case-note-dialog',
    template: `
        <card-dialog [view]="view" (dialogDismiss)="onDialogDismiss($event)" secureComponent></card-dialog>
    `,
    providers: [{ provide: AuthorizationProvider, useClass: AddCaseNotesAuthorizationProvider }, PolicySubscriber]
})
export class AddCaseNoteDialog extends SplitPaneDialogViewModel {
    public view: Type<AddCaseNoteComponent> = AddCaseNoteComponent;
    protected policy: PolicyDTO;
    private _parentNote: NoteDTO;

    @ViewChild(CardDialog)
    protected cardDialog: CardDialog;

    constructor(injector: Injector, i18n: I18n, policySubscriber: PolicySubscriber) {
        super(injector);
        this.i18n = i18n;
        policySubscriber.subscribe(this, policy => {
            this.policy = policy;
        });
    }

    public setModel(model: any): void {
        super.setModel(model);
        if (model.context) {
            this._parentNote = model.context.parentNote;
        }
    }

    protected getDialogParams(): CardDialogParams {
        return {
            title: this.getDialogTitle(),
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
                { resolveName: ResolvedDataNames.data, resolverClass: AddCaseNoteDataResolver },
                { resolveName: ResolvedDataNames.listData, resolverClass: AddCaseNoteListDataResolver },
                { resolveName: ResolvedDataNames.metaData, resolverClass: AddCaseNoteMetaDataResolver }
            ]
        };
    }

    protected getDialogTitle(): string {
        return this.showSupplementalNote()
            ? this.i18n({ value: 'Add Supplemental Note', id: 'policy.notes.addnotes.addsupplementalnotes' })
            : this.i18n({ value: 'Add Case Notes', id: 'policy.notes.addnotes.casenote.title' });
    }

    protected showSupplementalNote(): boolean {
        return this._parentNote != undefined;
    }

    protected onCardDialogOkClick(dialogResult: DialogResult): void {
        if (this.isSupplementalNoteAdded(dialogResult.returnValue)) {
            this.addSupplementalNoteToParentNote(dialogResult.returnValue);
        } else {
            this.addNoteToPolicy(dialogResult.returnValue);
        }
        this.saveData();
        this.onCardDialogButtonClick(dialogResult);
    }

    protected isSupplementalNoteAdded(newNote: NoteDTO): boolean {
        return newNote.ParentNoteId !== undefined;
    }

    protected addSupplementalNoteToParentNote(supplementalNote: NoteDTO): void {
        supplementalNote.DiaryDate = null;
        this._parentNote.ReferToUserId = supplementalNote.ReferToUserId;
        this._parentNote.Author = supplementalNote.Author;
        this._parentNote.SupplementalNotes.push(supplementalNote);
    }

    protected refreshPolicy(): void {
        const refreshPolicyHandler = this.injector.get(RefreshPolicyHandler);
        refreshPolicyHandler.execute();
    }

    private addNoteToPolicy(newNote: NoteDTO): void {
        this.policy.Notes_LazyLoad.push(newNote);
    }

    // State Management
    protected getStateValueKey(): string {
        return 'case_notes_dialog';
    }

    protected getSaveDataDelegate(): SavePolicyDataDelegate {
        return this.injector.get(SavePolicyDataDelegate);
    }

    protected getDataToSave(): any {
        return this.policy;
    }
}
