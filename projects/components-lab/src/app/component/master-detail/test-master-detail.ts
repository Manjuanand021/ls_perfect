import { Component, Injector, Input } from '@angular/core';

import { ListItem } from 'life-core/model';
import { ViewModel, ParentChildRegistry } from 'life-core/view-model';

import { AuthorizationProvider } from 'life-core/authorization';
import { TestMasterDetailAuthorizationProvider } from './test-master-authorization.provider';

@Component({
    selector: 'test-master-detail',
    templateUrl: './test-master-detail.html',
    providers: [
        ParentChildRegistry,
        { provide: AuthorizationProvider, useClass: TestMasterDetailAuthorizationProvider }
    ]
})
export class TestMasterDetail extends ViewModel {
    @Input()
    detailStyle: string;

    public detailStyleList: ListItem[];

    constructor(injector: Injector) {
        super(injector);
        this.detailStyleList = [new ListItem('Inline', 'inline'), new ListItem('Popup', 'popup')];
    }

    reset() {
        this.detailStyle = '';
    }
}
