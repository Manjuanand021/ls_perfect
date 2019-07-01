import { Injector } from '@angular/core';

import { DialogDetailViewModel } from 'life-core/component/master-detail';
import { DialogButtonType } from 'life-core/component/dialog';

export class BasePolicyDialogDetailViewModel<TData> extends DialogDetailViewModel<TData> {
    constructor(injector: Injector) {
        super(injector);
    }

    protected isDialogButtonTypeOK(buttonType: string): boolean {
        return buttonType === DialogButtonType.OK || buttonType === DialogButtonType.ACCEPT;
    }
}
