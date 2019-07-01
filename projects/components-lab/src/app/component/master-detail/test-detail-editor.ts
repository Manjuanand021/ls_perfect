import { Component, Injector, Injectable, OnDestroy } from '@angular/core';

import { DetailViewModel } from 'life-core/component/master-detail';
import { ViewValidationResult } from 'life-core/view-model';
import { Countries } from './test-data';

@Component({
    selector: 'test-detail-editor',
    templateUrl: './test-detail-editor.html'
})
@Injectable()
export class TestDetailEditor extends DetailViewModel<any> implements OnDestroy {
    public countryList: any[] = Countries;

    constructor(container: Injector) {
        super(container);
    }

    protected get itemType() {
        return 'test detail editior';
    }

    canDeactivate(): Promise<boolean> {
        console.debug(this.itemType + ' canDeactivate');
        return super.canDeactivate();
    }

    ngOnDestroy() {
        console.debug(this.itemType + ' deactivate');
        return super.ngOnDestroy();
    }

    protected setupData(): void {
        console.debug(this.itemType + ' setupData');
    }

    public loadData(): Promise<void> {
        console.debug('LoadData');
        return new Promise<void>((accept, reject) => {
            setTimeout(() => {
                accept();
            }, 200);
        });
    }

    public validate(): Promise<ViewValidationResult> {
        console.debug(this.itemType + ' Validate');
        return Promise.resolve(ViewValidationResult.pass);
    }
}
