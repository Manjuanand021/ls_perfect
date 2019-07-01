import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { NotesDataResolver } from 'business/policy/note/notes-data.resolver';
import { NotesModule } from 'business/policy/note/notes.module';
import { ViewNotesRoutingModule } from './view-notes-routing.module';
import { ViewNotesComponent } from './view-notes.component';
import { ViewNotesContextResolver } from './view-notes-context.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, NotesModule, ViewNotesRoutingModule],
    declarations: [ViewNotesComponent],
    providers: [NotesDataResolver, ViewNotesContextResolver]
})
export class ViewNotesModule {}
