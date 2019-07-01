import { Injector, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map, retry } from 'rxjs/operators';

import * as jsonUtil from 'life-core/util/json/json.util';
import { BaseDataServiceParams, LifeError } from './base-data-service.model';
import { ILogger, Logger } from 'life-core/logging';

// replaced RequestOptionsArgs this with any now
// export type HttpMethodType = { (url: string, body: any, options: RequestOptionsArgs): Observable<Response> };

export type HttpMethodType = {
    (
        url: string,
        body: any | null,
        options: {
            headers?:
                | HttpHeaders
                | {
                      [header: string]: string | string[];
                  };
            observe?: 'body';
            params?:
                | HttpParams
                | {
                      [param: string]: string | string[];
                  };
            reportProgress?: boolean;
            responseType: 'json';
            withCredentials?: boolean;
        }
    ): Observable<any>;
};

/**
 * Generic service interface.
 */
export interface IDataService<T> {
    /**
     * Process getData service request.
     *
     * @param params - service request parameters.
     */
    getData(params: BaseDataServiceParams): Promise<T>;

    /**
     * Process createData service request.
     *
     * @param params - service request parameters.
     */
    createData(params: BaseDataServiceParams): Promise<T>;

    /**
     * Process updateData service request.
     *
     * @param params - service request parameters.
     */
    updateData(params: BaseDataServiceParams): Promise<T>;

    /**
     * Process deleteData service request.
     *
     * @param params - service request parameters.
     */
    deleteData(params: BaseDataServiceParams): Promise<T>;

    /**
     * Event.
     */
    isProcessing: EventEmitter<boolean>;
}

/**
 * Generic JSON data service implementation.
 */
export abstract class BaseDataService<T> implements IDataService<T> {
    // http client for XHR calls
    protected _httpClient: HttpClient;

    private _inProcessRequests: number = 0;

    public isProcessing: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected criticalErrors: LifeError[];

    private _logger: ILogger;

    // private _logger = LogManager.getLogger('DataService');

    // protected messageHandler: DataServiceMessageHandler;

    /**
     * Creates new service and http client for XHR calls.
     */
    constructor(injector: Injector) {
        this._httpClient = injector.get(HttpClient);
        this._logger = injector.get(Logger);
    }

    public getData(params: BaseDataServiceParams): Promise<T> {
        return this.processRequest(this._httpClient.post, params);
    }

    public createData(params: BaseDataServiceParams): Promise<T> {
        return this.processRequest(this._httpClient.post, params);
    }

    public updateData(params: BaseDataServiceParams): Promise<T> {
        return this.processRequest(this._httpClient.post, params);
    }

    public deleteData(params: BaseDataServiceParams): Promise<T> {
        return this.processRequest(this._httpClient.post, params);
    }

    /**
     * Processes service request.
     */
    protected processRequest(method: HttpMethodType, params: BaseDataServiceParams): Promise<T> {
        if (!params.nonBlocking) {
            this.updateInProcessRequests(this._inProcessRequests + 1);
        }

        // create new data request
        const request = this.createRequest(params);

        // console.debug(`DataService -> processRequest -> sessionId: ${this.session.sessionId}`);
        this.logRequest(request);

        const headers = this.createHeaders();
        const serviceUrl = this.getServiceUrl(request);

        return (
            method
                .call(this._httpClient, serviceUrl, JSON.stringify(jsonUtil.removeCircularRefs(request)), {
                    headers: headers
                })
                .pipe(
                    // retry(1), // retry a failed request up to 1 time(s)
                    map((response: HttpResponse<T>) => jsonUtil.restoreCircularRefs(response)),
                    map((response: HttpResponse<T>) => {
                        if (!params.nonBlocking) {
                            this.updateInProcessRequests(this._inProcessRequests - 1);
                        }
                        this.logResponse(response);
                        return this.processResponse(response);
                    })
                )
                .toPromise()
                // this is http error
                .catch((response: HttpErrorResponse) => {
                    return new Promise((resolve, reject) => {
                        this.processHttpErrors(response);
                        reject(response);
                    });
                })
                .then((response: HttpResponse<T>) => {
                    this.processErrors(response);
                    if (this.hasCriticalError(response)) {
                        this.criticalErrors = [];
                    }
                    return Promise.resolve(response);
                })
        );
    }

    /**
     * Creates new data service request.
     */
    protected abstract createRequest(params: BaseDataServiceParams): any;

    protected createHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    protected abstract processHttpErrors(response: HttpErrorResponse): void;
    protected abstract getServiceUrl(request: any): string;

    /**
     * Processes service response and creates
     * generic data response object instance.
     */
    protected abstract processResponse(response: any): any;

    public hasCriticalError(response: any): boolean {
        return this.criticalErrors && this.criticalErrors.length > 0;
    }
    /**
     * Logs service response errors.
     *
     * @param errors error list.
     */
    protected abstract processErrors(response: any): void;

    private updateInProcessRequests(value: number): void {
        this._inProcessRequests = value;
        this.isProcessing.emit(this.processingRequests);
    }

    protected get processingRequests(): boolean {
        return this._inProcessRequests > 0;
    }

    /**
     * Logs service request for debug.
     */
    protected logRequest(request: any): void {
        this._logger.log('REQUEST', request);
    }

    /**
     * Logs service response for debug.
     */
    protected logResponse(response: any): void {
        this._logger.log('RESPONSE', response);
    }
}
