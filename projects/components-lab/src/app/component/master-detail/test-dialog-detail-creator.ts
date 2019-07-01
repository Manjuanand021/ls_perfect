import { Component, Injector, Injectable, OnDestroy } from '@angular/core';

import { DialogDetailViewModel } from 'life-core/component/master-detail';
import { DialogButtonType } from 'life-core/component/dialog';
import { ParentChildRegistry } from 'life-core/view-model';
import { Countries } from './test-data';

@Component({
    selector: 'test-detail-creator',
    templateUrl: './test-detail-creator.html',
    providers: [ParentChildRegistry]
})
@Injectable()
export class TestDialogDetailCreator extends DialogDetailViewModel<any> implements OnDestroy {
    public countryList: any[] = Countries;

    constructor(injector: Injector) {
        super(injector);
    }

    protected get itemType() {
        return 'test detail creator';
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

    protected isDialogButtonTypeOK(buttonType: string): boolean {
        return buttonType == DialogButtonType.OK;
    }
}
