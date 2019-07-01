import { Component, Injectable, Injector } from '@angular/core';
import { BaseOwnerTypeComponent } from '../base-owner-type.component';

@Component({
    selector: 'owner-person',
    templateUrl: './owner-person.component.html'
})
@Injectable()
export class OwnerPersonComponent extends BaseOwnerTypeComponent {
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
