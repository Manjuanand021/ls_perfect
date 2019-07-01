import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { RelatedCasesComponent } from './related-cases.component';
import { RelatedCasesDataResolver } from 'business/policy/related-cases/related-cases-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [RelatedCasesComponent],
    providers: [RelatedCasesDataResolver]
})
export class RelatedCasesModule {}
