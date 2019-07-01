import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { PhysicianInformationComponent } from './physician-information.component';
import { PhysicianInformationDialogDetailEditor } from './detail/physician-information-detail-editor';
import { PhysicianInformationDialogDataResolver } from './detail/physician-information-dialog-data.resolver';
import { PhysicianInformationDialogMetaDataResolver } from './detail/physician-information-dialog-meta-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [PhysicianInformationComponent, PhysicianInformationDialogDetailEditor],
    exports: [PhysicianInformationComponent, PhysicianInformationDialogDetailEditor],
    providers: [PhysicianInformationDialogDataResolver, PhysicianInformationDialogMetaDataResolver],
    entryComponents: [PhysicianInformationDialogDetailEditor]
})
export class PhysicianInformationModule {}
