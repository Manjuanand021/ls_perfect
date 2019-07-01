import { Component, Injector, Injectable } from '@angular/core';

import { BaseOwnerTypeComponent } from '../base-owner-type.component';

@Component({
    selector: 'owner-partnership',
    templateUrl: './owner-partnership.component.html'
})
@Injectable()
export class OwnerPartnershipComponent extends BaseOwnerTypeComponent {
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
