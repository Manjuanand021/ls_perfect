import { Component, Injector } from '@angular/core';

import { PrimaryTabHostViewModel } from 'life-core/component/layout/tabview';

@Component({
    selector: 'tab-home',
    templateUrl: './tab-home.component.html'
})
export class TabHomeComponent extends PrimaryTabHostViewModel {
    constructor(injector: Injector) {
        super(injector);
    }
}
