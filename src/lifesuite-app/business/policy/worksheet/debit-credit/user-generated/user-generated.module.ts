import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';
import { UserGeneratedComponent } from './user-generated.component';
import { MedicationComponent } from './medication/medication.component';
import { MedicalConditionComponent } from './medical-condition/medical-condition.component';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule],
    declarations: [UserGeneratedComponent, MedicationComponent, MedicalConditionComponent],
    exports: [UserGeneratedComponent]
})
export class UserGeneratedModule {}
