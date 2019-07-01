import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { CaseInformationComponent } from './case-information.component';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [CaseInformationComponent],
    exports: [CaseInformationComponent]
})
export class CaseInformationModule {}
