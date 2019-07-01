import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { AddCoverageComponent } from './add-coverage.component';
import { AddCoverageListDataResolver } from './add-coverage-listdata.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [AddCoverageComponent],
    exports: [AddCoverageComponent],
    entryComponents: [AddCoverageComponent],
    providers: [AddCoverageListDataResolver]
})
export class AddCoverageModule {}
