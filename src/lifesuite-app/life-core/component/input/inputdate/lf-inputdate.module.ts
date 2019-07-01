import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    NgbDateParserFormatter,
    NgbDatepickerI18n,
    NgbDatepickerConfig,
    NgbDateAdapter,
    NgbDateNativeAdapter
} from '@ng-bootstrap/ng-bootstrap';

import { LfInputDate } from './lf-inputdate';
import { LfDateParserFormatter } from './lf-inputdate-parser-formatter';
import { LfInputDateI18n } from './lf-inputdate-i18n';
import { LfInputDateConfig } from './lf-inputdate-config';
import { SettableContainerModule } from 'life-core/component/container/settable-container.module';

export const LF_INPUTDATE_EXPORTS: Array<any> = [LfInputDate];

@NgModule({
    imports: [CommonModule, FormsModule, SettableContainerModule],
    declarations: [LfInputDate],
    exports: [...LF_INPUTDATE_EXPORTS],
    providers: [
        { provide: NgbDatepickerI18n, useClass: LfInputDateI18n },
        { provide: NgbDateParserFormatter, useClass: LfDateParserFormatter },
        { provide: NgbDatepickerConfig, useClass: LfInputDateConfig },
        { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }
    ]
})
export class LfInputDateModule {}
