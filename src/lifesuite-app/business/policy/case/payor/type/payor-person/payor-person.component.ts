import { Component, Injectable, Injector } from '@angular/core';

import { PayorTypeComponent } from '../payor-type.component';

@Component({
    selector: 'payor-person',
    templateUrl: './payor-person.component.html'
})
@Injectable()
export class PayorPersonComponent extends PayorTypeComponent {
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
