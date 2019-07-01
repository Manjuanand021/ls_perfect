import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { RecentlyAccessedCasesComponent } from './recently-accessed-cases.component';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [RecentlyAccessedCasesComponent],
    exports: [RecentlyAccessedCasesComponent]
})
export class RecentlyAccessedCasesModule {}
