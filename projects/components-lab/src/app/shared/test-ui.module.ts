import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PanelModule } from 'primeng/panel';

import { MenuModule } from 'life-core/component/menu/menu.module';

/* Testing shell components */
import { TestNavBar } from 'lab/shared/test-nav-bar';
import { TestLeftNav } from 'lab/shared/test-left-nav';
import { TestLanding } from 'lab/shared/test-landing';

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule, PanelModule, MenuModule],
    declarations: [TestNavBar, TestLeftNav, TestLanding],
    exports: [TestNavBar, TestLeftNav]
})
export class TestUIModule {}
