import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Compose } from './compose';
import { ComposeService } from './compose.service';

@NgModule({
    imports: [CommonModule],
    declarations: [Compose],
    exports: [Compose],
    providers: [ComposeService]
})
export class ComposeModule {}
