import { Component, Injector } from '@angular/core';

import { NoteTypeComponent } from './note-type.component';

@Component({
    selector: 'uw-note',
    templateUrl: './uw-note.component.html'
})
export class UWNoteComponent extends NoteTypeComponent {
    constructor(injector: Injector) {
        super(injector);
    }
}
