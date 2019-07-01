import { Component, Injector } from '@angular/core';

import { SecondaryTabHostViewModel } from 'life-core/component/layout/tabview';
import { AuthorizationProvider } from 'life-core/authorization';

import { DefaultAuthorizationProvider } from 'business/shared/authorization/default-authorization.provider';

import { TasksFilterModel } from './filter';
import { PolicySubscriber } from 'ls-core/session';
import { TaskListColumnsBuilder } from './task-list/task-list-columns.builder';
import { TaskListGridDataSource } from './datasource';
import { TaskListImageService } from './task-list/task-list-image.service';
import { TaskFilterType } from './filter';

@Component({
    selector: 'tasks-tab',
    templateUrl: './tasks-tab.component.html',
    providers: [
        PolicySubscriber,
        { provide: AuthorizationProvider, useClass: DefaultAuthorizationProvider },
        TaskListColumnsBuilder,
        TaskListGridDataSource,
        TasksFilterModel,
        TaskListImageService
    ]
})
export class TasksTabComponent extends SecondaryTabHostViewModel {
    public taskFilter: TasksFilterModel;
    public taskFilterType: any = TaskFilterType;

    constructor(injector: Injector) {
        super(injector);
    }

    public setTaskFilter(value: TasksFilterModel): void {
        this.taskFilter = { ...value };
    }
}
