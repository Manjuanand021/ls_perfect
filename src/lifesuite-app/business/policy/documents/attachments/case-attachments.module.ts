import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { CaseAttachmentsComponent } from './case-attachments.component';
import { CaseAttachedDocuments } from './attached-documents/attached-documents.component';
import { CaseDocumentsForAttachment } from './documents-for-attachment/documents-for-attachment.component';
import { CaseAttachmentsResolver } from './case-attachments.resolver';
import { CaseAttachmentsMetaDataResolver } from './case-attachments-metadata.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [CaseAttachmentsComponent, CaseAttachedDocuments, CaseDocumentsForAttachment],
    providers: [CaseAttachmentsResolver, CaseAttachmentsMetaDataResolver]
})
export class CaseAttachmentsModule {}
