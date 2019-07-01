import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';
import { UIModule } from 'ui/ui.module';
import { LsErrorHandlerModule } from 'ls-core/error-handler';

import { MainTabViewModule } from './main-tabview.module';
import { LandingComponent } from './landing.component';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule, UIModule, LsErrorHandlerModule, MainTabViewModule],
    declarations: [LandingComponent]
})
export class LandingModule {}
