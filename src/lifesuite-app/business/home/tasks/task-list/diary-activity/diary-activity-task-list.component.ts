import { Component, Injector } from '@angular/core';

import { DiaryActivityProxyDTO } from 'ls-core/model/dto/diary-activity-proxy.dto';

import { TaskListColumnsBuilder } from '../task-list-columns.builder';
import { TaskListGridDataSource } from '../../datasource';
import { OpenDiaryActivityTaskDelegate } from '../delegates';
import { BaseTaskListComponent } from '../base-tasks-list.component';

@Component({
    selector: 'diary-activity-task-list',
    templateUrl: '../task-list.component.html',
    styleUrls: ['../task-list.component.scss'],
    providers: [OpenDiaryActivityTaskDelegate]
})
export class DiaryActivityTaskListComponent extends BaseTaskListComponent<DiaryActivityProxyDTO> {
    constructor(
        injector: Injector,
        taskListColumnsBuilder: TaskListColumnsBuilder,
        taskListGridDataSource: TaskListGridDataSource,
        openDiaryActivityTaskDelegate: OpenDiaryActivityTaskDelegate
    ) {
        super(injector, taskListColumnsBuilder, taskListGridDataSource, openDiaryActivityTaskDelegate);
    }

    protected rowDataMatch(rowData1: DiaryActivityProxyDTO, rowData2: DiaryActivityProxyDTO): boolean {
        return rowData1.NoteId === rowData2.NoteId;
    }
}
