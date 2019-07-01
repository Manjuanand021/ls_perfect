import { Component, Type, Injector } from '@angular/core';

import { I18n } from 'life-core/i18n';

import { DialogResult } from 'life-core/component';
import { NoteDTO, ReviewMessageDTO } from 'ls-core/model';

import { AddCaseNoteDialog } from 'business/policy/note/add-note/case-note/add-case-note-dialog';
import { AddReviewMessageNoteComponent } from './add-review-message-note.component';
import { PolicySubscriber } from 'ls-core/session';

@Component({
    selector: 'add-review-message-note-dialog',
    template: `
        <card-dialog [view]="view" (dialogDismiss)="onDialogDismiss($event)"></card-dialog>
    `,
    providers: [PolicySubscriber]
})
export class AddReviewMessageNoteDialog extends AddCaseNoteDialog {
    public view: Type<AddReviewMessageNoteComponent> = AddReviewMessageNoteComponent;

    constructor(injector: Injector, i18n: I18n, policySubscriber: PolicySubscriber) {
        super(injector, i18n, policySubscriber);
        this.i18n = i18n;
    }

    protected onCardDialogOkClick(dialogResult: DialogResult): void {
        if (this.isSupplementalNoteAdded(dialogResult.returnValue)) {
            this.addSupplementalNoteToParentNote(dialogResult.returnValue);
        } else {
            this.addNoteToReviewMessage(dialogResult.returnValue);
        }
        this.saveData();
        this.onCardDialogButtonClick(dialogResult);
    }

    protected getDialogTitle(): string {
        return this.showSupplementalNote()
            ? this.i18n({ value: 'Add Supplemental Note', id: 'policy.notes.addnotes.addsupplementalnotes' })
            : this.i18n({ value: 'Add New Notes', id: 'policy.notes.addnotes.newnote.title' });
    }

    private addNoteToReviewMessage(newNote: NoteDTO): void {
        const reviewMessage = this.splitArea.context.reviewMessage as ReviewMessageDTO;
        reviewMessage.reviewNote = newNote;
    }

    // State Management
    protected getStateValueKey(): string {
        return 'review_message_notes_dialog';
    }
}
