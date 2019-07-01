import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { VelogicaTabComponent } from './velogica-tab.component';
import { VelogicaComponent } from './velogica.component';
import { VelogicaDetailComponent } from './detail/velogica-detail.component';
import { VelogicaDataResolver } from './velogica-data.resolver';
import { VelogicaReasonsDataComponent } from './detail/reasons/velogica-reasons-data.component';

@NgModule({
    imports: [CommonModule, LsComponentsModule],
    declarations: [VelogicaTabComponent, VelogicaComponent, VelogicaDetailComponent, VelogicaReasonsDataComponent],
    providers: [VelogicaDataResolver],

    entryComponents: [VelogicaDetailComponent]
})
export class VelogicaModule {}
