import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';

import { MainTabViewComponent } from './main-tabview.component';
import { PolicyHelpersModule } from 'business/policy/shared/helper/policy-helpers.module';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule, PolicyHelpersModule],
    declarations: [MainTabViewComponent],
    exports: [MainTabViewComponent]
})
export class MainTabViewModule {}
