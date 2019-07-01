import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularSplitModule, SplitComponent, SplitAreaDirective } from 'angular-split';

import { LfSplitComponentModule, LF_SPLIT_COMPONENT_EXPORTS } from './split-component/lf-split-component.module';
import { LfSplitPaneModule, LF_SPLIT_PANE_EXPORTS } from './split-pane/lf-split-pane.module';

export const LF_SPLIT_EXPORTS: Array<any> = [
    SplitAreaDirective,
    SplitComponent,
    LfSplitComponentModule,
    LF_SPLIT_COMPONENT_EXPORTS,
    LfSplitPaneModule,
    ...LF_SPLIT_PANE_EXPORTS
];

@NgModule({
    imports: [CommonModule, AngularSplitModule, LfSplitComponentModule, LfSplitPaneModule],
    declarations: [],
    exports: [...LF_SPLIT_EXPORTS]
})
export class LfSplitModule {}
