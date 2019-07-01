import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';

import { CustomRouteReuseStrategy } from 'life-core/routing/custom-route-reuse.strategy';
import { CanDeactivateGuard } from 'life-core/view-model';

import { TestLanding } from 'lab/shared/test-landing';
import { TestItemLists } from 'lab/component/item-list/test-item-lists';
import { TestMasterDetail } from 'lab/component/master-detail/test-master-detail';
import { TestDialog } from 'lab/component/dialog/test-dialog';
import { TestMaterial2AppComponent } from 'lab/material2';
import { TestToaster } from 'lab/component/misc/test-toaster';
import { TestFormInputs } from 'lab/component/form/test-form-inputs';
import { TestParentFormView } from 'lab/component/dynamic-form/test-parent-form-view';
import { DynamicFormDataResolver } from 'lab/component/dynamic-form/dynamic-form-data.resolver';
import { TestDataGrid } from 'lab/component/grid/test-data-grid';
import { TestToolbar } from 'lab/component/misc/test-toolbar';
import { TestMessaging } from 'lab/messaging/test-messaging';
import { TestAuthorization } from 'lab/authorization/test-authorization';
import { TestAuthorizationData } from 'lab/authorization/test-authorization-data';
import { TestAuthorizationParent } from 'lab/authorization/test-authorization-tree';
import { TestPanel } from 'lab/component/misc/test-panel';
import { TestSupplementalNote } from 'lab/component/misc/test-supplemental-note';
import { TestRadioButtonGroup } from 'lab/component/input/test-radiobutton-group';
import { TestButton } from 'lab/component/misc/test-button';
import { TestInputNumber } from 'lab/component/input/test-inputnumber';
import { TestInputText } from 'lab/component/input/test-inputtext';
import { TestDropDown } from 'lab/component/input/test-dropdown';
import { TestInputDate } from 'lab/component/input/test-inputdate';
import { TestInputMask } from 'lab/component/input/test-inputmask';
import { TestCheckbox } from './component/input/test-checkbox';
import { TestInputTextarea } from './component/input/test-inputtextarea';
import { TestInputPhone } from './component/input/test-inputphone';
import { TestSampleCompositeInput } from './component/input/test-sample-composite-input';
import { TestInputBankAccount } from './component/input/test-inputbankaccount';

export const routes: Routes = [
    { path: '', redirectTo: 'test/landing', pathMatch: 'full' },
    { path: 'test/landing', component: TestLanding },
    { path: 'test/item-lists', component: TestItemLists },
    { path: 'test/master-detail', component: TestMasterDetail },
    { path: 'test/form-inputs', component: TestFormInputs },
    {
        path: 'test/authorization/components',
        component: TestAuthorization,
        children: [
            {
                path: 'all/:level',
                component: TestAuthorizationData,
                resolve: { formFields: DynamicFormDataResolver }
            }
        ]
    },
    { path: 'test/authorization/tree', component: TestAuthorizationParent },
    { path: 'test/dynamic-form', component: TestParentFormView, resolve: { formFields: DynamicFormDataResolver } },
    // PrimeNG
    { path: 'test/test-toaster', component: TestToaster },
    { path: 'test/test-toolbar', component: TestToolbar },
    { path: 'test/test-panel', component: TestPanel },
    { path: 'test/test-supplemental-note', component: TestSupplementalNote },
    { path: 'test/test-radiobutton-group', component: TestRadioButtonGroup },
    { path: 'test/test-button', component: TestButton },
    { path: 'test/test-inputnumber', component: TestInputNumber },
    { path: 'test/test-inputtext', component: TestInputText },
    { path: 'test/test-dropdown', component: TestDropDown },
    { path: 'test/test-inputdate', component: TestInputDate },
    { path: 'test/test-inputmask', component: TestInputMask },
    { path: 'test/test-checkbox', component: TestCheckbox },
    { path: 'test/test-inputtextarea', component: TestInputTextarea },
    { path: 'test/test-inputphone', component: TestInputPhone },
    { path: 'test/test-sample-composite-input', component: TestSampleCompositeInput },
    { path: 'test/test-inputbankaccount', component: TestInputBankAccount },
    { path: 'test/dialogs', component: TestDialog },
    { path: 'test/tabview', loadChildren: 'lab/component/tab-view/test-tabview.module#TestTabViewModule' },
    //Data Grid
    { path: 'test/ag-grid', component: TestDataGrid },
    { path: 'test/messaging', component: TestMessaging },
    // Angular Material 2
    { path: 'test/material2', component: TestMaterial2AppComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [CanDeactivateGuard, { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }]
})
export class TestRoutingModule {}
