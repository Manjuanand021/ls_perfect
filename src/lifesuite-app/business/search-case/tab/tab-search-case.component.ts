import { Component, Injector } from '@angular/core';

import { PrimaryTabHostViewModel } from 'life-core/component';
import { ParentChildRegistry } from 'life-core/view-model';

@Component({
    selector: 'tab-search-case',
    templateUrl: './tab-search-case.component.html',
    providers: [ParentChildRegistry]
})
export class TabSearchCaseComponent extends PrimaryTabHostViewModel {
    constructor(injector: Injector) {
        super(injector);
    }
}
