import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from 'life-core/component/components.module';
import { LsPolicyAlert } from './ls-policy-alert';

export const LS_POLICY_ALERT_EXPORTS: Array<any> = [LsPolicyAlert];

@NgModule({
    imports: [FormsModule, ComponentsModule],
    declarations: [LsPolicyAlert],
    providers: [],
    exports: [...LS_POLICY_ALERT_EXPORTS]
})
export class LsPolicyAlertModule {}
