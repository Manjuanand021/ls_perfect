import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { CaseTemplatesComponent } from 'business/policy/documents/templates/case-templates.component';
import { CaseTemplateList } from 'business/policy/documents/templates/list';
import { CaseTemplatesMetaDataResolver } from './case-templates-metadata.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [CaseTemplatesComponent, CaseTemplateList],
    providers: [CaseTemplatesMetaDataResolver]
})
export class CaseTemplatesModule {}
