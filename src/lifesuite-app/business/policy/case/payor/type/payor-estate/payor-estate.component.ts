import { Component, Injectable, Injector } from '@angular/core';

import { PayorTypeComponent } from '../payor-type.component';

@Component({
    selector: 'payor-estate',
    templateUrl: './payor-estate.component.html'
})
@Injectable()
export class PayorEstateComponent extends PayorTypeComponent {
    public maxTrustDate: Date = new Date();

    constructor(injector: Injector) {
        super(injector);
    }
}
