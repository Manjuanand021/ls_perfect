import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';

import { PasswordChangeComponent } from './password-change.component';

@NgModule({
    imports: [CommonModule, FormsModule, ComponentsModule],
    declarations: [PasswordChangeComponent],
    exports: [PasswordChangeComponent],
    entryComponents: [PasswordChangeComponent]
})
export class PasswordChangeModule {}
