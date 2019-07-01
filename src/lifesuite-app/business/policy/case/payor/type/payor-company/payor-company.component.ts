import { Component, Injectable, Injector } from '@angular/core';

import { PayorTypeComponent } from '../payor-type.component';

@Component({
    selector: 'payor-company',
    templateUrl: './payor-company.component.html'
})
@Injectable()
export class PayorCompanyComponent extends PayorTypeComponent {
    constructor(injector: Injector) {
        super(injector);
    }
}
