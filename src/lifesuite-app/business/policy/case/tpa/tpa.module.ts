import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { TPAComponent } from './tpa.component';
import { TPAInfoComponent } from './info/tpa-info.component';
import { TPADataResolver } from './tpa-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [TPAComponent, TPAInfoComponent],
    exports: [TPAComponent],
    entryComponents: [TPAInfoComponent],
    providers: [TPADataResolver]
})
export class TPAModule {}
