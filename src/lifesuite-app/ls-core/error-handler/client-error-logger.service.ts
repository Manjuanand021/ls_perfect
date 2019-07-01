import { Injectable } from '@angular/core';

import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';
import { LsAppConfig } from 'ls-core/config';

import { DisplayUIErrorDialogDelegate } from './display-ui-error-dialog.delegate';

export interface IClientErrorLoggerService {
    logError(error: Error): void;
}

@Injectable()
export class ClientErrorLoggerService implements IClientErrorLoggerService {
    private _dataService: DataService;
    private _displayErrorDialogDelegate: DisplayUIErrorDialogDelegate;
    private _lastRequestSentTime: number = 0;
    private _config: LsAppConfig;

    constructor(
        dataService: DataService,
        displayUIErrorDialogDelegate: DisplayUIErrorDialogDelegate,
        config: LsAppConfig
    ) {
        this._dataService = dataService;
        this._displayErrorDialogDelegate = displayUIErrorDialogDelegate;
        this._config = config;
    }

    public logError(error: Error): void {
        if (this.isThrottled()) {
            return;
        }
        const errorCollection = this.buildErrorCollection(error);
        this.logToServer(errorCollection);

        // logging to the server can fail
        // this can lead to a runaway loop where
        // this failure can lead to logToServer being
        // called over and over… let's break the cycle
        this._lastRequestSentTime = this.getCurrentTime();
    }

    private buildErrorCollection(error: Error): UIClientException[] {
        return [
            new UIClientException({
                message: error.message,
                errorCode: '',
                errorName: error.name,
                errorID: '',
                stackTrace: error.stack,
                errorToString: '',
                dateTimeOccured: new Date()
            })
        ];
    }

    private logToServer(errorCollection: UIClientException[]): Promise<void> {
        const serviceParams = this.getServiceParams(errorCollection);
        return this._dataService.updateData(serviceParams).then(response => {
            if (response.responsePayload) {
                const clientExceptionResponse = response.responsePayload as UIClientExceptionResponse;
                if (this._config.showClientErrorDialog && clientExceptionResponse) {
                    this._displayErrorDialogDelegate.showError(clientExceptionResponse.Exceptions);
                }
            }
        });
    }

    private getServiceParams(errorCollection: UIClientException[]): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.UI_EXCEPTION_SERVICE,
            serviceMethod: UIServiceMethods.DO_PROCESS,
            requestPayload: this.buildRequestPayload(errorCollection)
        });
    }

    private buildRequestPayload(errorCollection: UIClientException[]): UIClientExceptionLogRequest {
        return new UIClientExceptionLogRequest(errorCollection);
    }

    private isThrottled(): boolean {
        return this.getCurrentTime() - this._lastRequestSentTime < 1000;
    }

    private getCurrentTime(): number {
        return new Date().getTime();
    }
}

export class UIClientMappedException {
    public readonly $type: string = 'life.ls.ui.ria.dto.exceptions.UIClientMappedException, LifeSuite.UIServiceDTO';

    public Message: string;

    public ErrorCode: string;

    public ErrorName: string;

    public ErrorID: string;

    constructor({
        message,
        errorCode,
        errorName,
        errorID
    }: {
        message: string;
        errorCode: string;
        errorName: string;
        errorID: string;
    }) {
        this.Message = message;
        this.ErrorCode = errorCode;
        this.ErrorName = errorName;
        this.ErrorID = errorID;
    }
}

class UIClientException extends UIClientMappedException {
    public readonly $type: string = 'life.ls.ui.ria.dto.exceptions.UIClientException, LifeSuite.UIServiceDTO';

    public StackTrace: string;

    public ErrorToString: string;

    public DateTimeOccured: Date;

    constructor({
        message,
        errorCode,
        errorName,
        errorID,
        stackTrace,
        errorToString,
        dateTimeOccured
    }: {
        message: string;
        errorCode: string;
        errorName: string;
        errorID: string;
        stackTrace: string;
        errorToString: string;
        dateTimeOccured: Date;
    }) {
        super({ message, errorCode, errorName, errorID });
        this.Message = message;
        this.ErrorCode = errorCode;
        this.ErrorName = errorName;
        this.ErrorID = errorID;
        this.StackTrace = stackTrace;
        this.ErrorToString = errorToString;
        this.DateTimeOccured = dateTimeOccured;
    }
}

class UIClientExceptionLogRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.UIClientExceptionLogRequest, LifeSuite.UIServiceDTO';
    public Exceptions: UIClientException[];

    constructor(exceptions: UIClientException[]) {
        this.Exceptions = exceptions;
    }
}

class UIClientExceptionResponse {
    public Exceptions: UIClientMappedException[];

    constructor(exceptions: UIClientMappedException[]) {
        this.Exceptions = exceptions;
    }
}
