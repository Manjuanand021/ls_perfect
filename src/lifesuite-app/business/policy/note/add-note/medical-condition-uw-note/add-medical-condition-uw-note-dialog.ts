import { Component, Type } from '@angular/core';

import { AddUWNoteDialog } from 'business/policy/note/add-note/uw-note';
import { AddMedicalConditionUWNoteComponent } from './add-medical-condition-uw-note.component';
import { PolicySubscriber } from 'ls-core/session';

@Component({
    selector: 'add-medical-condition-uw-note-dialog',
    template: `
        <card-dialog [view]="view" (dialogDismiss)="onDialogDismiss($event)"></card-dialog>
    `,
    providers: [PolicySubscriber]
})
export class AddMedicalConditionUWNoteDialog extends AddUWNoteDialog {
    public view: Type<AddMedicalConditionUWNoteComponent> = AddMedicalConditionUWNoteComponent;

    // State Management
    protected getStateValueKey(): string {
        return 'medical_condition_uw_notes_dialog';
    }
}
