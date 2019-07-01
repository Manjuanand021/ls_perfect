import { Component, Injector } from '@angular/core';

import { PhysicianTypesComponent } from '../physician-types.component';

@Component({
    selector: 'physician-facility-name',
    templateUrl: './physician-facility-name.component.html'
})
export class PhysicianFacilityNameComponent extends PhysicianTypesComponent {
    constructor(injector: Injector) {
        super(injector);
    }
}
