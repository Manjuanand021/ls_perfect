import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Toaster } from './toaster';

export const TOASTER_EXPORTS: Array<any> = [Toaster];

@NgModule({
    imports: [CommonModule],
    declarations: [Toaster],
    exports: [...TOASTER_EXPORTS]
})
export class ToasterModule {}
