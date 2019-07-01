import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { CaseDocumentsComponent } from './case-documents.component';
import { CaseTemplatesModule } from './templates';
import { CaseAttachmentsModule } from './attachments';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, CaseTemplatesModule, CaseAttachmentsModule],
    declarations: [CaseDocumentsComponent]
})
export class CaseDocumentsModule {}
