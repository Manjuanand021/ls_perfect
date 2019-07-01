import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'life-core/util/pipe/pipe.module';

import {
    NgSelectModule,
    ɵn as ConsoleService,
    ɵk as VirtualScrollService,
    ɵl as WindowService,
    NgSelectConfig
} from '@ng-select/ng-select';

import { LfSelect } from './lf-select';
import { LfSelectConfig } from './lf-select.config';
import { LfDropdownPanelComponent } from './lf-dropdown-panel';
import { SettableContainerModule } from 'life-core/component/container/settable-container.module';

export const LF_SELECT_EXPORTS: Array<any> = [LfSelect, LfDropdownPanelComponent];

@NgModule({
    imports: [CommonModule, FormsModule, NgSelectModule, PipeModule, SettableContainerModule],
    declarations: [LfSelect, LfDropdownPanelComponent],
    exports: [...LF_SELECT_EXPORTS],
    providers: [
        ConsoleService,
        WindowService,
        VirtualScrollService,
        {
            provide: NgSelectConfig,
            useClass: LfSelectConfig
        }
    ]
})
export class LfSelectModule {}
