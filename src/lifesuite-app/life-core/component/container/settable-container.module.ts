import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SettableContainerDirective } from './settable-container.directive';

export const SETTABLE_CONTAINER_EXPORTS: Array<any> = [SettableContainerDirective];

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [SettableContainerDirective],
    exports: [...SETTABLE_CONTAINER_EXPORTS]
})
export class SettableContainerModule {}
