import { Injectable, Injector } from '@angular/core';

import { LifeError, ErrorHandlerChannels } from 'life-core/service';
import { MessagingService } from 'life-core/messaging';
import { Logger, ILogger } from 'life-core/logging';
import { IIPObjectError } from 'ls-core/service/data-service.model';
import { ErrorHandlerUtil } from './error-handler.util';

@Injectable()
export class ApplicationErrorFilter {
    protected applicationErrors: Array<LifeError> = [];
    protected criticalErrors: Array<LifeError> = [];
    protected _messageService: MessagingService;
    protected logger: ILogger;

    constructor(injector: Injector) {
        this._messageService = injector.get(MessagingService);
        this.logger = injector.get(Logger);
    }

    private convertError(errorAray: IIPObjectError[]): void {
        this.applicationErrors = [];
        this.criticalErrors = [];
        if (errorAray && errorAray.length > 0) {
            for (const error of errorAray) {
                if (this.isSystemError(error)) {
                    this.criticalErrors.push(ErrorHandlerUtil.mapError(error));
                } else {
                    this.applicationErrors.push(ErrorHandlerUtil.mapError(error));
                }
            }
        }
    }

    private isSystemError(error: IIPObjectError): boolean {
        return (
            error.errorCodes &&
            error.errorCodes.some(erroeCode => {
                return erroeCode == SYSTEM_CRITICAL_ERROR;
            })
        );
    }

    public hasCriticalError(): boolean {
        return this.criticalErrors.length > 0;
    }

    public getCriticalErrors(): LifeError[] {
        return this.criticalErrors;
    }

    public processError(errorAray: IIPObjectError[]): void {
        this.convertError(errorAray);
        // push error to message queue;
        this.handleError();
    }

    protected handleError(): void {
        if (this.criticalErrors.length > 0) {
            this.logger.error('Critical Errors', this.criticalErrors);
            this._messageService.publish(ErrorHandlerChannels.CriticalError, this.criticalErrors);
        } else if (this.applicationErrors.length > 0) {
            // Application errors are handled in ViewModel
            this.logger.warn('Application Errors', this.applicationErrors);
        }
    }
}

export const SYSTEM_CRITICAL_ERROR = 'InternalServerError';
