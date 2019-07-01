import { Component, Injector } from '@angular/core';

import { BeneficiaryTypeComponent } from '../beneficiary-type.component';

@Component({
    selector: 'beneficiary-estate',
    templateUrl: './beneficiary-estate.component.html'
})
export class BeneficiaryEstateComponent extends BeneficiaryTypeComponent {
    public maxDate: Date;

    constructor(injector: Injector) {
        super(injector);
        this.maxDate = new Date();
    }
}
