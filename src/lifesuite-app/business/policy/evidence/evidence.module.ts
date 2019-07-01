import { EvidenceInfoDataInitializer } from './evidence-info-data.initializer';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { EvidenceComponent } from './evidence.component';
import { TabViewEvidenceComponent } from './tab/tabview-evidence.component';
import { EvidenceDataResolver } from './evidence-data.resolver';
import { LabModule } from './lab/lab.module';
import { RxModule } from './rx/rx.module';
import { MIBModule } from './mib';
import { MVRModule } from './mvr/mvr.module';
import { ParamedicalModule } from './paramedical/paramedical.module';
import { MedicalConditionModule } from './medical-condition/medical-condition.module';
import { VelogicaModule } from './velogica/velogica.module';
import { EvidenceMetaDataResolver } from './evidence-meta-data.resolver';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LsComponentsModule,
        LabModule,
        MIBModule,
        RxModule,
        MVRModule,
        ParamedicalModule,
        MedicalConditionModule,
        VelogicaModule
    ],
    declarations: [EvidenceComponent, TabViewEvidenceComponent],
    providers: [EvidenceDataResolver, EvidenceMetaDataResolver, EvidenceInfoDataInitializer]
})
export class EvidenceModule {}
