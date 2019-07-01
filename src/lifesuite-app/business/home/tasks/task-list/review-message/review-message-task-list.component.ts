import { Component, Injector } from '@angular/core';

import { ReviewMessageProxyDTO } from 'ls-core/model/dto/review-message-proxy.dto';

import { TaskListColumnsBuilder } from '../task-list-columns.builder';
import { TaskListGridDataSource } from '../../datasource';
import { OpenRevMsgTaskDelegate } from '../delegates';

import { BaseTaskListComponent } from '../base-tasks-list.component';

@Component({
    selector: 'review-message-task-list',
    templateUrl: '../task-list.component.html',
    styleUrls: ['../task-list.component.scss'],
    providers: [OpenRevMsgTaskDelegate]
})
export class ReviewMessageTaskListComponent extends BaseTaskListComponent<ReviewMessageProxyDTO> {
    constructor(
        injector: Injector,
        taskListColumnsBuilder: TaskListColumnsBuilder,
        taskListGridDataSource: TaskListGridDataSource,
        openRevMsgTaskDelegate: OpenRevMsgTaskDelegate
    ) {
        super(injector, taskListColumnsBuilder, taskListGridDataSource, openRevMsgTaskDelegate);
    }

    protected rowDataMatch(rowData1: ReviewMessageProxyDTO, rowData2: ReviewMessageProxyDTO): boolean {
        return rowData1.ReviewMessageId === rowData2.ReviewMessageId;
    }
}
