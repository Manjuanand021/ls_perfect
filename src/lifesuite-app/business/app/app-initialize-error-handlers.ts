import { Injectable } from '@angular/core';

import { IErrorHandler } from 'life-core/service';
import { AuthorizationFailureErrorHandler, SystemErrorHandler } from 'ls-core/service/error-handler';

@Injectable()
export class AppInitializeErrorHandlers {
    private _authorizationFailureErrorHandler: AuthorizationFailureErrorHandler;
    private _systemErrorHandler: SystemErrorHandler;

    constructor(
        authorizationFailureErrorHandler: AuthorizationFailureErrorHandler,
        systemErrorHandler: SystemErrorHandler
    ) {
        this._systemErrorHandler = systemErrorHandler;
        this._authorizationFailureErrorHandler = authorizationFailureErrorHandler;
    }

    public initialize(): void {
        this.registerErrorHandlers([this._systemErrorHandler, this._authorizationFailureErrorHandler]);
    }

    private registerErrorHandlers(errorHandlers: IErrorHandler[]): void {
        errorHandlers.forEach(handler => handler.register());
    }
}
