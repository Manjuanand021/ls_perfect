import { Component, Injector } from '@angular/core';

import { BeneficiaryTypeComponent } from '../beneficiary-type.component';

@Component({
    selector: 'beneficiary-person',
    templateUrl: './beneficiary-person.component.html'
})
export class BeneficiaryPersonComponent extends BeneficiaryTypeComponent {
    public maxBirthDate: Date;

    constructor(injector: Injector) {
        super(injector);
        this.maxBirthDate = this.setBirthDateLimit();
    }

    private setBirthDateLimit(): Date {
        const today = new Date().getDate();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return new Date(currentYear, currentMonth, today - 1);
    }
}
