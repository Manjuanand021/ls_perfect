import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { AgencyComponent } from './agency.component';
import { AgencyInfoComponent } from './agency-info.component';
import { AgencyDataResolver } from './agency-data.resolver';
import { CaseMetaDataResolver } from 'business/policy/case/case-meta-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [AgencyComponent, AgencyInfoComponent],
    exports: [AgencyComponent],
    entryComponents: [AgencyInfoComponent],
    providers: [AgencyDataResolver, CaseMetaDataResolver]
})
export class AgencyModule {}
