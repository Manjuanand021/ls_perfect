import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { LifeError, ErrorHandlerChannels } from 'life-core/service';
import { ApplicationErrorFilter } from './application-error-filter';
import { CRITICAL_ERROR_LEVEL } from './error-constants';

const ERROR_TYPE_HTTP = 400;

@Injectable()
export class HttpErrorFilter extends ApplicationErrorFilter {
    constructor(injector: Injector) {
        super(injector);
    }

    private convertHttpError(response: HttpErrorResponse): void {
        const lifeError = new LifeError();
        lifeError.errorCode = new Array(response.status.toString());
        lifeError.errorMessage = response.statusText;
        lifeError.errorType = ERROR_TYPE_HTTP;
        lifeError.date = new Date();
        lifeError.severityLevel = CRITICAL_ERROR_LEVEL;
        this.criticalErrors.push(lifeError);
    }

    public processHttpError(response: HttpErrorResponse): void {
        this.convertHttpError(response);
        // push error to message queue;
        this.handleError();
    }

    protected handleError(): void {
        if (this.criticalErrors.length > 0) {
            this.logger.error('RESPONSE ERRORS', this.criticalErrors);
            const httpErrorKey = this.criticalErrors[0].errorCode[0];
            if (httpErrorKey) {
                this._messageService.publish(HttpErrorToChannelMap[httpErrorKey], this.criticalErrors);
            }
        }
    }
}

const HttpErrorToChannelMap = {
    '400': ErrorHandlerChannels.HttpErrorBadRequest,
    '401': ErrorHandlerChannels.HttpErrorUnauthorized
};
