import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { TabHomeComponent } from './tab/tab-home.component';
import { TabViewHomeComponent } from './tab/tabview-home.component';
import { PolicyListComponent, PolicyListTabComponent } from './policy-list';
import {
    PolicyListFilterComponent,
    PolicyListFilterBuilder,
    PolicyListFilterMetaDataResolver,
    UserTeamDataResolver
} from './policy-list/filter';
import { HomeRoutingModule } from './home-routing.module';
import { TasksModule } from './tasks';
import { SummaryModule } from './summary';
import { ApplicantStatusUtil } from 'business/home/policy-list/applicant-status/applicant-status.util';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule, HomeRoutingModule, TasksModule, SummaryModule],
    declarations: [
        TabHomeComponent,
        TabViewHomeComponent,
        PolicyListTabComponent,
        PolicyListComponent,
        PolicyListFilterComponent
    ],
    providers: [PolicyListFilterBuilder, PolicyListFilterMetaDataResolver, UserTeamDataResolver, ApplicantStatusUtil]
})
export class HomeModule {}
