import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';
import { ViewModelModule } from 'life-core/view-model/view-model.module';

import { LsPolicyToolbar } from './ls-policy-toolbar';

export const LS_POLICY_TOOLBAR_EXPORTS: Array<any> = [LsPolicyToolbar];

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule, ViewModelModule],
    declarations: [LsPolicyToolbar],
    providers: [],
    exports: [...LS_POLICY_TOOLBAR_EXPORTS]
})
export class LsPolicyToolbarModule {}
