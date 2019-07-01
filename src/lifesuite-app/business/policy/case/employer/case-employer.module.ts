import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { EmployerComponent } from './case-employer.component';
import { EmployerInfoComponent } from './info/case-employer-info.component';
import { EmployerDataResolver } from './case-employer-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [EmployerComponent, EmployerInfoComponent],
    exports: [EmployerComponent],
    entryComponents: [EmployerInfoComponent],
    providers: [EmployerDataResolver]
})
export class EmployerModule {}
