import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LsComponentsModule } from 'ls-core/component/ls-components.module';

import { TabViewWorksheetComponent } from './tab/tabview-worksheet.component';
import { CaseDispositionModule } from './case-disp/case-disp.module';
import { ReviewMessagesModule } from './review-messages/review-messages.module';
import { DebitCreditModule } from './debit-credit/debit-credit.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LsComponentsModule,
        CaseDispositionModule,
        ReviewMessagesModule,
        DebitCreditModule
    ],
    declarations: [TabViewWorksheetComponent],
    providers: []
})
export class WorksheetModule {}
