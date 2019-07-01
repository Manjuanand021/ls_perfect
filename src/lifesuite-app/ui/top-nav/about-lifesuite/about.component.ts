import { Component, VERSION } from '@angular/core';

import { ICompose } from 'life-core/component/compose';
import { IDialogViewModel, DialogViewModelResult } from 'life-core/component/dialog';

@Component({
    selector: 'ls-about',
    templateUrl: './about.component.html'
})
export class AboutComponent implements ICompose, IDialogViewModel {
    public angularVersion: string;
    public lifeSuiteVersion: string;

    constructor() {
        this.angularVersion = VERSION.full;
    }

    public setModel(model: any): void {
        this.lifeSuiteVersion = model.resolvedData[0].assemblyVersion;
    }

    public onDialogButtonClick(buttonId: string): Promise<DialogViewModelResult> {
        return Promise.resolve(null);
    }
}
