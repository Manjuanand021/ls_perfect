import { Component, Injectable, Injector } from '@angular/core';
import { PayorTypeComponent } from '../payor-type.component';

@Component({
    selector: 'payor-trust',
    templateUrl: './payor-trust.component.html'
})
@Injectable()
export class PayorTrustComponent extends PayorTypeComponent {
    public maxTrustDate: Date = new Date();

    constructor(injector: Injector) {
        super(injector);
    }
}
