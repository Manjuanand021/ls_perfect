import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from 'life-core/component/components.module';
import { TopNavComponent } from './top-nav.component';
import { AboutComponent, LifeSuiteVersionResolver } from './about-lifesuite';

import { QuickSearchOpenPolicyDelegate } from './search/quick-search-open-policy.delegate';
import { QuickSearchPolicyHandler } from './search/quick-search-policy.handler';

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule, ComponentsModule],
    declarations: [TopNavComponent, AboutComponent],
    exports: [TopNavComponent],
    providers: [QuickSearchPolicyHandler, QuickSearchOpenPolicyDelegate, LifeSuiteVersionResolver],
    entryComponents: [AboutComponent]
})
export class TopNavModule {}
