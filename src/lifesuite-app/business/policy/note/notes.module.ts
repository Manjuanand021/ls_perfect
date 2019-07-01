import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { NoteInfoComponent } from './note-info.component';
import { CaseNotesComponent } from './case-notes.component';
import { UWNotesComponent } from './uw-notes.component';
import { NoteListComponent } from './note-list/note-list.component';
import { NotesDataResolver } from './notes-data.resolver';
import { NotesMetaDataResolver } from './notes-meta-data.resolver';
import { CaseNoteComponent, UWNoteComponent } from './type';
import {
    AddCaseNoteComponent,
    AddCaseNoteDialog,
    AddCaseNoteDataResolver,
    AddCaseNoteMetaDataResolver,
    AddCaseNoteListDataResolver
} from './add-note/case-note';
import { AddUWNoteDialog, AddUWNoteComponent } from './add-note/uw-note';
import { AddRequirementNoteComponent, AddRequirementCaseNoteDialog } from './add-note/requirement-case-note';
import {
    AddMedicalConditionUWNoteDialog,
    AddMedicalConditionUWNoteComponent
} from 'business/policy/note/add-note/medical-condition-uw-note';
import {
    AddReviewMessageNoteComponent,
    AddReviewMessageNoteDialog
} from 'business/policy/note/add-note/review-message-note';
import { CheckableMessagesComponent } from 'business/policy/note/add-note/review-message-note/checkable-messages/checkable-messages.component';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [
        NoteListComponent,
        CaseNotesComponent,
        UWNotesComponent,
        NoteInfoComponent,
        CaseNoteComponent,
        UWNoteComponent,
        AddCaseNoteComponent,
        AddCaseNoteDialog,
        AddUWNoteComponent,
        AddUWNoteDialog,
        AddRequirementNoteComponent,
        AddRequirementCaseNoteDialog,
        AddMedicalConditionUWNoteComponent,
        AddMedicalConditionUWNoteDialog,
        CheckableMessagesComponent,
        AddReviewMessageNoteComponent,
        AddReviewMessageNoteDialog
    ],
    exports: [NoteListComponent, CaseNotesComponent, UWNotesComponent, NoteInfoComponent],
    providers: [
        NotesDataResolver,
        NotesMetaDataResolver,
        AddCaseNoteDataResolver,
        AddCaseNoteMetaDataResolver,
        AddCaseNoteListDataResolver
    ],
    entryComponents: [
        NoteInfoComponent,
        CaseNoteComponent,
        UWNoteComponent,
        AddCaseNoteComponent,
        AddCaseNoteDialog,
        AddUWNoteComponent,
        AddUWNoteDialog,
        AddRequirementNoteComponent,
        AddRequirementCaseNoteDialog,
        AddMedicalConditionUWNoteComponent,
        AddMedicalConditionUWNoteDialog,
        AddReviewMessageNoteComponent,
        AddReviewMessageNoteDialog
    ]
})
export class NotesModule {}
