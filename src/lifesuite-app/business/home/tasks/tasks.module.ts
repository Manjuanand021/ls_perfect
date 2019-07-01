import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { TasksTabComponent } from './tasks-tab.component';
import { TasksFilterComponent } from './filter';
import { TaskListMetaDataResolver } from './task-list/task-list-metadata.resolver';
import { TaskUtil } from './task-util';
import {
    DiaryActivityTaskListComponent,
    ImageReceivedTaskListComponent,
    InboxOutBoxTaskListComponent,
    MibTaskListComponent,
    RequirementTaskListComponent,
    ReviewMessageTaskListComponent
} from './task-list';
import { TaskFilterService } from './filter/task-filter.service';

@NgModule({
    imports: [CommonModule, FormsModule, LsComponentsModule],
    declarations: [
        TasksTabComponent,
        TasksFilterComponent,
        DiaryActivityTaskListComponent,
        ImageReceivedTaskListComponent,
        InboxOutBoxTaskListComponent,
        MibTaskListComponent,
        RequirementTaskListComponent,
        ReviewMessageTaskListComponent
    ],
    providers: [TaskListMetaDataResolver, TaskUtil, TaskFilterService],
    exports: [TasksTabComponent]
})
export class TasksModule {}
