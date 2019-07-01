import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { IntlModule } from 'life-core/i18n/intl.module';
import { ComponentsModule } from 'life-core/component/components.module';
import { TestDialog, SampleDialogResolveData } from './test-dialog';
import { ModalDialogDetail, PopoverDialogDetail } from './dialog-detail';

@NgModule({
    imports: [CommonModule, FormsModule, IntlModule, ComponentsModule, NgbModule.forRoot()],
    declarations: [TestDialog, ModalDialogDetail, PopoverDialogDetail],
    providers: [SampleDialogResolveData],
    entryComponents: [ModalDialogDetail, PopoverDialogDetail]
})
export class TestDialogModule {}
