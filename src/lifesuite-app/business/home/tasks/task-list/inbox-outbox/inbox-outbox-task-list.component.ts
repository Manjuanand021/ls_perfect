import { Component, Injector } from '@angular/core';

import { ReferralProxyDTO } from 'ls-core/model';

import { TaskListColumnsBuilder } from '../task-list-columns.builder';
import { OpenInboxOutboxTaskDelegate } from '../delegates';
import { TaskListGridDataSource } from '../../datasource';
import { BaseTaskListComponent } from '../base-tasks-list.component';

@Component({
    selector: 'inbox-outbox-task-list',
    templateUrl: '../task-list.component.html',
    styleUrls: ['../task-list.component.scss'],
    providers: [OpenInboxOutboxTaskDelegate]
})
export class InboxOutBoxTaskListComponent extends BaseTaskListComponent<ReferralProxyDTO> {
    constructor(
        injector: Injector,
        taskListColumnsBuilder: TaskListColumnsBuilder,
        taskListGridDataSource: TaskListGridDataSource,
        openInboxOutboxTaskDelegate: OpenInboxOutboxTaskDelegate
    ) {
        super(injector, taskListColumnsBuilder, taskListGridDataSource, openInboxOutboxTaskDelegate);
    }

    protected rowDataMatch(rowData1: ReferralProxyDTO, rowData2: ReferralProxyDTO): boolean {
        return rowData1.NoteId === rowData2.NoteId;
    }
}
