import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule, COMPONENTS_EXPORTS } from 'life-core/component/components.module';
import { LsPipeModule, LS_PIPE_EXPORTS } from 'ls-core/util/pipe/ls-pipe.module';
import { LsFormatterModule } from 'ls-core/util/formatter/ls-formatter.module';
/* Components */
import { LsDynamicFormModule } from './dynamic-form/ls-dynamic-form.module';
import { LsInputsModule, LS_INPUT_EXPORTS } from './input/ls-inputs.module';
import { LsDataGridModule } from './grid';
import { LsNoteModule, LS_NOTE_EXPORTS } from './ls-note/ls-note.module';
import {
    LsSupplementalNoteModule,
    LS_SUPPLEMENTAL_NOTE_EXPORTS
} from './supplemental-note/ls-supplemental-note.module';
import { LsPolicyAlertModule, LS_POLICY_ALERT_EXPORTS } from './policy-alert/ls-policy-alert.module';
import { LsPolicyToolbarModule, LS_POLICY_TOOLBAR_EXPORTS } from './toolbar';
import { LsMasterDetailModule } from './master-detail/ls-master-detail.module';

export const LS_COMPONENTS_EXPORTS: Array<any> = [
    ...LS_INPUT_EXPORTS,
    ...LS_NOTE_EXPORTS,
    ...LS_SUPPLEMENTAL_NOTE_EXPORTS,
    ...LS_PIPE_EXPORTS,
    ...LS_POLICY_ALERT_EXPORTS,
    ...LS_POLICY_TOOLBAR_EXPORTS
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ComponentsModule,
        LsInputsModule,
        LsDynamicFormModule,
        LsDataGridModule,
        LsMasterDetailModule,
        LsNoteModule,
        LsSupplementalNoteModule,
        LsPipeModule,
        LsFormatterModule,
        LsPolicyAlertModule,
        LsPolicyToolbarModule
    ],
    declarations: [],
    exports: [COMPONENTS_EXPORTS, LS_COMPONENTS_EXPORTS]
})
export class LsComponentsModule {}
