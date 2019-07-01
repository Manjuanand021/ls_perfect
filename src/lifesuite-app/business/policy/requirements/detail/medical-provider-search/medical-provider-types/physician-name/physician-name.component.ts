import { Component, Injector } from '@angular/core';

import { PhysicianTypesComponent } from '../physician-types.component';

@Component({
    selector: 'physician-name',
    templateUrl: './physician-name.component.html'
})
export class PhysicianNameComponent extends PhysicianTypesComponent {
    constructor(injector: Injector) {
        super(injector);
    }
}
