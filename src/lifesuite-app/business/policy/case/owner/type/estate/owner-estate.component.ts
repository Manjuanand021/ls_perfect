import { Component, Injector, Injectable } from '@angular/core';
import { BaseOwnerTypeComponent } from '../base-owner-type.component';

@Component({
    selector: 'owner-estate',
    templateUrl: './owner-estate.component.html'
})
@Injectable()
export class OwnerEstateComponent extends BaseOwnerTypeComponent {
    public maxTrustDate: Date = new Date();

    constructor(injector: Injector) {
        super(injector);
    }
}
