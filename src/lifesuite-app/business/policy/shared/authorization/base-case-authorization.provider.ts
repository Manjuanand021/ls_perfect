import { Injector } from '@angular/core';

import { AuthorizationProvider } from 'life-core/authorization';

import { AppSession } from 'ls-core/session';
import { PolicyDTO } from 'ls-core/model';

export abstract class BaseCaseAuthorizationProvider extends AuthorizationProvider {
    private _appSession: AppSession;

    constructor(injector: Injector, parentAuthProvider: AuthorizationProvider) {
        super(parentAuthProvider);
        this._appSession = injector.get(AppSession);
    }

    protected get policy(): PolicyDTO {
        return this._appSession.policyDTO;
    }
}
