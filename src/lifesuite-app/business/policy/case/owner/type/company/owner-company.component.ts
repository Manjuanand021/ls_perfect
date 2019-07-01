import { Component, Injector, Injectable } from '@angular/core';

import { BaseOwnerTypeComponent } from '../base-owner-type.component';

@Component({
    selector: 'owner-company',
    templateUrl: './owner-company.component.html'
})
@Injectable()
export class OwnerCompanyComponent extends BaseOwnerTypeComponent {
    constructor(injector: Injector) {
        super(injector);
    }
}
