import { Injectable } from '@angular/core';
import { AppSession } from './app-session';
import { PolicyDTO } from '../model/dto';

@Injectable()
export class PolicyInSessionUpdater {
    private _appSession: AppSession;

    constructor(appSession: AppSession) {
        this._appSession = appSession;
    }

    public updatePolicy(policy: PolicyDTO): void {
        this._appSession.updatePolicy(policy);
    }
}
