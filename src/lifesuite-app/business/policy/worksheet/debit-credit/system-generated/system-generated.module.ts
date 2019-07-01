import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';
import { SystemGeneratedComponent } from './system-generated.component';
import { RiskFactorComponent } from './risk-factor/risk-factor.component';
import { MedicationComponent } from './medication/medication.component';
import { MedicalConditionComponent } from './medical-condition/medical-condition.component';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule],
    declarations: [SystemGeneratedComponent, RiskFactorComponent, MedicationComponent, MedicalConditionComponent],
    exports: [SystemGeneratedComponent]
})
export class SystemGeneratedModule {}
