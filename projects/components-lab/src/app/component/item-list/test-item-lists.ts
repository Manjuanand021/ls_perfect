import { Component, Injectable, Injector } from '@angular/core';

import { ViewModel, ParentChildRegistry } from 'life-core/view-model';

@Component({
	selector: 'test-item-lists',
	templateUrl: './test-item-lists.html',
	providers: [ParentChildRegistry]
})

@Injectable()
export class TestItemLists extends ViewModel {

	constructor(container: Injector) {
        super(container);
    }
}
