import { Session } from 'life-core/session';
import { AppSession } from 'ls-core/session';
import { BaseStartupContextResolver } from 'life-core/startup';

export abstract class LsStartupContextResolver<T> extends BaseStartupContextResolver<T> {
    private _appSession: AppSession;

    constructor(appSession: AppSession) {
        super();
        this._appSession = appSession;
    }

    protected get session(): Session {
        return this._appSession;
    }
}
