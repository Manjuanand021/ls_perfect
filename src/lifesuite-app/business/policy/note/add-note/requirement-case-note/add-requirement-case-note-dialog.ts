import { Component, Type } from '@angular/core';

import { DialogResult } from 'life-core/component';
import { SaveDataResult } from 'life-core/service';

import { NoteDTO, RequirementDTO } from 'ls-core/model';
import { PolicySubscriber } from 'ls-core/session';

import { AddCaseNoteDialog } from 'business/policy/note/add-note/case-note';
import { AddRequirementNoteComponent } from './add-requirement-note.component';

@Component({
    selector: 'add-requirement-case-note-dialog',
    template: `
        <card-dialog [view]="view" (dialogDismiss)="onDialogDismiss($event)" secureComponent></card-dialog>
    `,
    providers: [PolicySubscriber]
})
export class AddRequirementCaseNoteDialog extends AddCaseNoteDialog {
    public view: Type<AddRequirementNoteComponent> = AddRequirementNoteComponent;
    private _activeRequirement: RequirementDTO;

    protected onCardDialogOkClick(dialogResult: DialogResult): void {
        this._activeRequirement = this.splitArea.context.requirement as RequirementDTO;
        if (this.isSupplementalNoteAdded(dialogResult.returnValue)) {
            this.addSupplementalNoteToParentNote(dialogResult.returnValue);
        } else {
            this.addNoteToRequirement(dialogResult.returnValue);
        }
        this.saveData().then((result: SaveDataResult) => {
            // pass InsuredRequirementId back requirement component to select active requirement
            dialogResult.returnValue = this._activeRequirement.InsuredRequirementId.toString();
            this.onCardDialogButtonClick(dialogResult);
        });
    }

    private addNoteToRequirement(newNote: NoteDTO): void {
        const requirementInPolicy = this.policy.Requirements_LazyLoad.find(
            req => req.RequirementCode == this._activeRequirement.RequirementCode
        );
        requirementInPolicy.Note = newNote;
    }

    // State Management
    protected getStateValueKey(): string {
        return 'requrement_case_notes_dialog';
    }
}
