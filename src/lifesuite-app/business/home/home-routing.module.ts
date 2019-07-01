import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';

import { LsResolveUtil } from 'ls-core/routing';
import { LsRoutePath } from 'ui/routing';

// HOME TAB
import { TabHomeComponent } from 'business/home/tab/tab-home.component';
import {
    PolicyListTabComponent,
    PolicyListFilterMetaDataResolver,
    UserTeamDataResolver
} from 'business/home/policy-list';
import { TasksTabComponent } from 'business/home/tasks';
import { SummaryTabComponent } from 'business/home/summary';
import { TaskListMetaDataResolver } from 'business/home/tasks/task-list/task-list-metadata.resolver';

const AppHomeWorkItemsRoute: Route = {
    path: LsRoutePath.WorkItems,
    component: PolicyListTabComponent,
    resolve: {
        listData: UserTeamDataResolver,
        metaData: PolicyListFilterMetaDataResolver
    }
};

const AppHomeTasksRoute: Route = {
    path: LsRoutePath.Tasks,
    component: TasksTabComponent,
    resolve: {
        listData: UserTeamDataResolver,
        metaData: TaskListMetaDataResolver
    }
};

const AppHomeSummaryRoute: Route = {
    path: LsRoutePath.Summary,
    component: SummaryTabComponent,
    resolve: LsResolveUtil.getListDataResolver(UserTeamDataResolver)
};

const AppHomeRoutes: Routes = [
    {
        path: '',
        component: TabHomeComponent,
        children: [AppHomeWorkItemsRoute, AppHomeTasksRoute, AppHomeSummaryRoute]
    }
];

@NgModule({
    imports: [RouterModule.forChild(AppHomeRoutes)],
    exports: [RouterModule]
})
export class HomeRoutingModule {}
