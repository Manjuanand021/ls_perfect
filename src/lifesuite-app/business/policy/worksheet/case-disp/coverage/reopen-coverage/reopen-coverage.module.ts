import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';

import { ReopenCoverageComponent } from './reopen-coverage.component';
import { ReopenCoverageMetaDataResolver } from './reopen-coverage-metadata.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule],
    declarations: [ReopenCoverageComponent],
    exports: [ReopenCoverageComponent],
    entryComponents: [ReopenCoverageComponent],
    providers: [ReopenCoverageMetaDataResolver]
})
export class ReopenCoverageModule {}
