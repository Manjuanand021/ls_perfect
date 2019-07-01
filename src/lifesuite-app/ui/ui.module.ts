import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LeftNavModule } from './left-nav/left-nav.module';
import { LeftNavComponent } from './left-nav/left-nav.component';
import { TopNavModule } from './top-nav/top-nav.module';
import { TopNavComponent } from './top-nav/top-nav.component';
import { OpenAppHandler } from 'ui/startup/open-app.handler';
import { PreferencesModule } from './top-nav/preferences/preferences.module';
import { TabViewModule } from './tabview/tabview.module';

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule, LeftNavModule, TopNavModule, PreferencesModule, TabViewModule],
    declarations: [],
    exports: [LeftNavComponent, TopNavComponent],
    providers: [OpenAppHandler]
})
export class UIModule {}
