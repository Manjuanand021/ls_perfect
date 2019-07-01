import { Component, Injector } from '@angular/core';

import { BeneficiaryTypeComponent } from '../beneficiary-type.component';

@Component({
    selector: 'beneficiary-company',
    templateUrl: './beneficiary-company.component.html'
})
export class BeneficiaryCompanyComponent extends BeneficiaryTypeComponent {
    constructor(injector: Injector) {
        super(injector);
    }
}
