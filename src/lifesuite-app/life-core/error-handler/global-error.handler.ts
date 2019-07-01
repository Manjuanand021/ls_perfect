import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ClientErrorLogger } from './client-error-logger';
import { Logger, ILogger } from 'life-core/logging';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private _clientErrorLogger: ClientErrorLogger;
    private _logger: ILogger;

    constructor(clientErrorLogger: ClientErrorLogger, logger: Logger) {
        this._clientErrorLogger = clientErrorLogger;
        this._logger = logger;
    }

    public handleError(error: any): void {
        try {
            // log only UI/client errors
            if (!this.isServerError(error)) {
                this._clientErrorLogger.logError(error);
            }
        } catch (error) {
            this._logger.log(`An error occurred trying to invoke one of the global action handlers. ${error.Message}`);
        }
    }

    private isServerError(error: any): boolean {
        return error.hasOwnProperty('rejection') && error['rejection'] instanceof HttpErrorResponse;
    }
}
