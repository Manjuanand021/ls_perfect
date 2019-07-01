import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { LsPipeModule } from 'ls-core/util/pipe/ls-pipe.module';

import { MedicalConditionMetaDataResolver } from './medical-condition-meta-data.resolver';
import { MedicalConditionTabComponent } from './medical-condition-tab.component';
import { MedicalConditionComponent } from './medical-condition.component';
import { MedicalConditionDataResolver } from './medical-condition-data.resolver';
import {
    MedicalConditionDetailCreatorComponent,
    MedicalConditionDataListComponent,
    MedicalConditionDetailDataResolver,
    MedicalConditionDetailEditorComponent
} from './detail';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, LsPipeModule],
    declarations: [
        MedicalConditionTabComponent,
        MedicalConditionComponent,
        MedicalConditionDataListComponent,
        MedicalConditionDetailCreatorComponent,
        MedicalConditionDetailEditorComponent
    ],
    providers: [
        DatePipe,
        MedicalConditionDataResolver,
        MedicalConditionMetaDataResolver,
        MedicalConditionDetailDataResolver
    ],
    entryComponents: [MedicalConditionDetailCreatorComponent, MedicalConditionDetailEditorComponent]
})
export class MedicalConditionModule {}
