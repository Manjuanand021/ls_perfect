import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IntlModule } from 'life-core/i18n/intl.module';

import { ComponentsModule } from 'life-core/component/components.module';
import { LsComponentsModule } from 'ls-core/component/ls-components.module';
import { LplaComponentsModule } from 'lpla-core/component/lpla-components.module';

import { TestToaster } from './test-toaster';
import { TestToolbar } from './test-toolbar';
import { TestPanel } from './test-panel';
import { TestSupplementalNote } from './test-supplemental-note';
import { TestButton } from './test-button';

@NgModule({
    imports: [CommonModule, FormsModule, IntlModule, ComponentsModule, LsComponentsModule, LplaComponentsModule],
    declarations: [TestToaster, TestToolbar, TestPanel, TestSupplementalNote, TestButton],
    providers: []
})
export class TestMiscModule {}
