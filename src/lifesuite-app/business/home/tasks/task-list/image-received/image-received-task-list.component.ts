import { Component, Injector } from '@angular/core';

import { TaskListColumnsBuilder } from '../task-list-columns.builder';
import { TaskListGridDataSource } from '../../datasource';
import { TaskListImageService } from '../task-list-image.service';
import { BaseTaskListComponent } from '../base-tasks-list.component';

@Component({
    selector: 'image-received-task-list',
    templateUrl: '../task-list.component.html',
    styleUrls: ['../task-list.component.scss'],
    providers: [TaskListImageService]
})
export class ImageReceivedTaskListComponent extends BaseTaskListComponent<any> {
    constructor(
        injector: Injector,
        taskListColumnsBuilder: TaskListColumnsBuilder,
        taskListGridDataSource: TaskListGridDataSource
    ) {
        // TODO - pass the delegate to base class once delegate is created
        super(injector, taskListColumnsBuilder, taskListGridDataSource);
    }

    // TODO - need to implement logic
    protected rowDataMatch(rowData1: any, rowData2: any): boolean {
        return false;
    }
}
