import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { ParamedicalTabComponent } from 'business/policy/evidence/paramedical/paramedical.component';
import { ParamedicalDataResolver } from 'business/policy/evidence/paramedical/paramedical-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [ParamedicalTabComponent],
    providers: [ParamedicalDataResolver]
})
export class ParamedicalModule {}
