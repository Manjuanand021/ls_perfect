import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularSplitModule } from 'angular-split';

import { LfSplitComponent } from './lf-split.component';
import { LfSplitAreaDirective } from './lf-split-area.directive';
import { LfSplitGutterDirective } from './lf-split-gutter.directive';

export const LF_SPLIT_COMPONENT_EXPORTS: Array<any> = [LfSplitAreaDirective, LfSplitComponent, LfSplitGutterDirective];

@NgModule({
    imports: [CommonModule, AngularSplitModule],
    declarations: [LfSplitComponent, LfSplitAreaDirective, LfSplitGutterDirective],
    exports: [...LF_SPLIT_COMPONENT_EXPORTS]
})
export class LfSplitComponentModule {}
