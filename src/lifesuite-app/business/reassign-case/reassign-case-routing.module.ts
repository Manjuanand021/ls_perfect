import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReassignFromUserResolver } from 'business/reassign-case/reassign-case-list-data.resolver';
import { ReassignCaseComponent } from './reassign-case.component';

const ReassignCaseRoutes: Routes = [
    {
        path: '',
        component: ReassignCaseComponent,
        resolve: {
            listData: ReassignFromUserResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(ReassignCaseRoutes)],
    exports: [RouterModule]
})
export class ReassignCaseRoutingModule {}
