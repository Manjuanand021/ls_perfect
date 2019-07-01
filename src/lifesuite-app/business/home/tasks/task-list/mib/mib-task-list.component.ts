import { Component, Injector } from '@angular/core';

import { PolicyProxyDTO } from 'ls-core/model';

import { TaskListColumnsBuilder } from '../task-list-columns.builder';
import { TaskListGridDataSource } from '../../datasource';
import { OpenMibTwoYrDelegate } from '../delegates';
import { BaseTaskListComponent } from '../base-tasks-list.component';
import { MIBTwoYearCountService } from '../mib-two-year.service';

@Component({
    selector: 'mib-task-list',
    templateUrl: '../task-list.component.html',
    styleUrls: ['../task-list.component.scss'],
    providers: [MIBTwoYearCountService, OpenMibTwoYrDelegate]
})
export class MibTaskListComponent extends BaseTaskListComponent<PolicyProxyDTO> {
    constructor(
        injector: Injector,
        taskListColumnsBuilder: TaskListColumnsBuilder,
        taskListGridDataSource: TaskListGridDataSource,
        openMibTwoYrDelegate: OpenMibTwoYrDelegate
    ) {
        super(injector, taskListColumnsBuilder, taskListGridDataSource, openMibTwoYrDelegate);
    }

    protected rowDataMatch(rowData1: PolicyProxyDTO, rowData2: PolicyProxyDTO): boolean {
        return rowData1.RequirementInformationId === rowData2.RequirementInformationId;
    }
}
