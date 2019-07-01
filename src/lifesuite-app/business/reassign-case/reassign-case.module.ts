import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { ReassignCaseRoutingModule } from '../reassign-case/reassign-case-routing.module';
import { ReassignCaseComponent } from './reassign-case.component';
import { ReassignCaseGridComponent } from './grid/reassign-case-grid.component';
import { ReassignCasesService } from './services/reassign-case.service';
import { ReassignFromUserResolver } from './reassign-case-list-data.resolver';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, ReassignCaseRoutingModule],
    declarations: [ReassignCaseComponent, ReassignCaseGridComponent],
    providers: [ReassignCasesService, ReassignFromUserResolver]
})
export class ReassignCaseModule {}
