import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { AssociationComponent } from './case-association.component';
import { AssociationInfoComponent } from './case-association-info.component';
import { AssociationDataResolver } from './case-association-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [AssociationComponent, AssociationInfoComponent],
    exports: [AssociationComponent],
    entryComponents: [AssociationInfoComponent],
    providers: [AssociationDataResolver]
})
export class AssociationModule {}
