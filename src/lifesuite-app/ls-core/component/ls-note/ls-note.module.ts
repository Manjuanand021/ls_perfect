import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LsNote } from './ls-note';

export const LS_NOTE_EXPORTS: Array<any> = [LsNote];

@NgModule({
    imports: [FormsModule],
    declarations: [LsNote],
    providers: [],
    exports: [...LS_NOTE_EXPORTS]
})
export class LsNoteModule {}
