import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
    TestRoutedTabView,
    HomeComp,
    SearchComp,
    SimpleComp,
    TabbedComp,
    CaseDispComp,
    MessagesComp,
    PolicyDetailComp,
    ParentDataResolver,
    ChildDataResolver
} from './test-routed-tabview';

export const testTabViewRoutes: Routes = [
    {
        path: '',
        component: TestRoutedTabView,
        children: [
            { path: 'home', component: HomeComp },
            { path: 'search', component: SearchComp },
            { path: 'simple-comp/:id', component: SimpleComp, resolve: { parentData: ParentDataResolver } },
            {
                path: 'policy/:id',
                component: TabbedComp,
                resolve: { childData: ParentDataResolver },
                children: [
                    { path: 'case-disp', component: CaseDispComp, resolve: { childData: ChildDataResolver } },
                    { path: 'review-messages', component: MessagesComp },
                    { path: 'policy-details', component: PolicyDetailComp, resolve: { childData: ChildDataResolver } }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(testTabViewRoutes)],
    exports: [RouterModule]
})
export class TestTabViewRoutingModule {}
