import { Component, Injector } from '@angular/core';

import { PhysicianTypesComponent } from '../physician-types.component';

@Component({
    selector: 'physician-facility',
    templateUrl: './physician-facility.component.html'
})
export class PhysicianAssociatedWithFacilityComponent extends PhysicianTypesComponent {
    constructor(injector: Injector) {
        super(injector);
    }
}
