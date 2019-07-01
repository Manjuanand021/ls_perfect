import { Component } from '@angular/core';

import { ParentChildRegistry } from 'life-core/view-model';
import { PolicySubscriber } from 'ls-core/session';
import { NoteTypes } from 'ls-core/model';

import { AddUWNoteComponent } from 'business/policy/note/add-note/uw-note';

@Component({
    selector: 'add-medical-condition-uw-note',
    templateUrl: '../uw-note/add-uw-note.component.html',
    providers: [ParentChildRegistry, PolicySubscriber]
})
export class AddMedicalConditionUWNoteComponent extends AddUWNoteComponent {
    protected getNoteType(): string {
        return NoteTypes.MEDCON_NOTE;
    }
}
