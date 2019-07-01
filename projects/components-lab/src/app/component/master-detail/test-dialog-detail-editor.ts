import { Component, Injector, Injectable, OnDestroy } from '@angular/core';

import { DialogDetailViewModel } from 'life-core/component/master-detail';
import { DialogButtonType } from 'life-core/component/dialog';
import { ParentChildRegistry } from 'life-core/view-model';
import { Countries } from './test-data';

@Component({
    selector: 'test-detail-editor',
    templateUrl: './test-detail-editor.html',
    providers: [ParentChildRegistry]
})
@Injectable()
export class TestDialogDetailEditor extends DialogDetailViewModel<any> implements OnDestroy {
    public countryList: any[] = Countries;

    constructor(injector: Injector) {
        super(injector);
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

    protected isDialogButtonTypeOK(buttonType: string): boolean {
        return buttonType == DialogButtonType.OK;
    }
    //public validate(): Promise<boolean> {
    //	console.debug(this.itemType + ' Validate');
    //	return Promise.resolve(true);
    //}
}
