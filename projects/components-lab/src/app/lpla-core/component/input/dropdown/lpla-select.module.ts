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

import { LplaSelect } from './lpla-select';
import { SettableContainerModule } from 'life-core/component/container/settable-container.module';
import { LfSelectModule } from 'life-core/component/input/dropdown/lf-select.module';
import { LfSelectConfig } from 'life-core/component/input/dropdown/lf-select.config';

export const LPLA_SELECT_EXPORTS: Array<any> = [LplaSelect];

@NgModule({
    imports: [CommonModule, FormsModule, NgSelectModule, LfSelectModule, PipeModule, SettableContainerModule],
    declarations: [LplaSelect],
    exports: [...LPLA_SELECT_EXPORTS],
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
export class LplaSelectModule {}
