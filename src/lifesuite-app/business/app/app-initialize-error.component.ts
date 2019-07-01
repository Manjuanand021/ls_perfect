import { Component } from '@angular/core';

import { AppSession } from 'ls-core/session';

@Component({
    selector: 'app-initialize-error',
    templateUrl: './app-initialize-error.component.html'
})
export class AppInitializeErrorComponent {
    public errorMessage: string;

    private _appSession: AppSession;

    constructor(appSession: AppSession) {
        this._appSession = appSession;
        this.setupData();
    }

    private setupData(): void {
        this.errorMessage = this._appSession.initializeError;
    }
}
