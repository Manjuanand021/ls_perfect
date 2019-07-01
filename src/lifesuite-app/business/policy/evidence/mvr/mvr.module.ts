import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { MVRComponent } from './mvr.component';
import { MVRDataResolver } from './mvr-data.resolver';
import { MVRTabComponent } from './mvr-tab.component';
import { MVRDetailComponent, MVRDetailViolationsComponent } from './detail';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [MVRTabComponent, MVRComponent, MVRDetailComponent, MVRDetailViolationsComponent],
    entryComponents: [MVRDetailComponent],
    providers: [MVRDataResolver]
})
export class MVRModule {}
