import { Injectable } from '@angular/core';

import { IClientErrorLoggerService, ClientErrorLoggerService } from './client-error-logger.service';
import { ClientErrorLogger } from 'life-core/error-handler/client-error-logger';
import { Logger, ILogger } from 'life-core/logging';

@Injectable()
export class LsClientErrorLogger extends ClientErrorLogger {
    private _clientErrorLoggerService: IClientErrorLoggerService;
    private _logger: ILogger;

    constructor(clientErrorLoggerService: ClientErrorLoggerService, logger: Logger) {
        super();
        this._clientErrorLoggerService = clientErrorLoggerService;
        this._logger = logger;
    }

    public logError(error: Error): void {
        this.logClientError(error);
        this.logToConsole(error);
    }

    private logClientError(error: Error): void {
        this._clientErrorLoggerService.logError(error);
    }

    private logToConsole(error: Error): void {
        this._logger.error(error.stack);
    }
}
