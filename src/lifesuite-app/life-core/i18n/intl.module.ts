import { NgModule } from '@angular/core';

import { IntlModule as KendoIntlModule } from '@kendo/kendo-angular-intl';
import { IntlService } from './intl.service';

@NgModule({
    imports: [KendoIntlModule],
    providers: [IntlService]
})
export class IntlModule {}
