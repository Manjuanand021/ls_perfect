import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PolicyQuickInfoPanelModule } from 'business/policy/policy-quick-info-panel';

import { QuickInfoPanelComponent } from './quick-info-panel.component';

@NgModule({
    imports: [CommonModule, FormsModule, PolicyQuickInfoPanelModule],
    declarations: [QuickInfoPanelComponent],
    exports: [QuickInfoPanelComponent]
})
export class QuickInfoPanelModule {}
