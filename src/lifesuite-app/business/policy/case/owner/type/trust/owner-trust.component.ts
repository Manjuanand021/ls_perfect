import { Component, Injector, Injectable } from '@angular/core';
import { BaseOwnerTypeComponent } from '../base-owner-type.component';

@Component({
    selector: 'owner-trust',
    templateUrl: './owner-trust.component.html'
})
@Injectable()
export class OwnerTrustComponent extends BaseOwnerTypeComponent {
    public maxTrustDate: Date = new Date();

    constructor(injector: Injector) {
        super(injector);
    }
}
