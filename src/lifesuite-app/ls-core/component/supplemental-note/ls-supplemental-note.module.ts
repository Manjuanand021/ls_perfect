import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LsSupplementalNote } from './ls-supplemental-note';

export const LS_SUPPLEMENTAL_NOTE_EXPORTS: Array<any> = [LsSupplementalNote];

@NgModule({
    imports: [FormsModule],
    declarations: [LsSupplementalNote],
    providers: [],
    exports: [...LS_SUPPLEMENTAL_NOTE_EXPORTS]
})
export class LsSupplementalNoteModule {}
