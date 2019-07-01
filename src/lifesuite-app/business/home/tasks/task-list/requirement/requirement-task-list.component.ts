import { Component, Injector } from '@angular/core';

import { RequirementProxy } from 'ls-core/model';

import { TaskListColumnsBuilder } from '../task-list-columns.builder';
import { TaskListGridDataSource } from '../../datasource';
import { OpenRequirementsDelegate } from '../delegates';
import { BaseTaskListComponent } from '../base-tasks-list.component';

@Component({
    selector: 'requirement-task-list',
    templateUrl: '../task-list.component.html',
    styleUrls: ['../task-list.component.scss'],
    providers: [OpenRequirementsDelegate]
})
export class RequirementTaskListComponent extends BaseTaskListComponent<RequirementProxy> {
    constructor(
        injector: Injector,
        taskListColumnsBuilder: TaskListColumnsBuilder,
        taskListGridDataSource: TaskListGridDataSource,
        openRequirementsDelegate: OpenRequirementsDelegate
    ) {
        super(injector, taskListColumnsBuilder, taskListGridDataSource, openRequirementsDelegate);
    }

    protected rowDataMatch(rowData1: RequirementProxy, rowData2: RequirementProxy): boolean {
        return rowData1.InsuredRequirementId === rowData2.InsuredRequirementId;
    }
}
