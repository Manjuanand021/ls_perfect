import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { BaseDataService, HttpMethodType } from 'life-core/service';
import { ServiceUrls } from './service-urls';
import { DataServiceParams, UIRequest, UIResponse } from './data-service.model';
import { ServiceRequestQueue, ServiceRequest } from './service-request-queue';
import { LsAppConfig } from 'ls-core/config/ls-app.config';
import { ApplicationErrorFilter } from 'ls-core/service/error-handler/application-error-filter';
import { HttpErrorFilter } from 'ls-core/service/error-handler/http-error-filter';

const HTTP_STATUS_OK: Number = 200;

@Injectable()
export class DataService extends BaseDataService<UIResponse> {
    private _serviceRequestQueue: ServiceRequestQueue;
    private _allowConcurrentServiceRequests: boolean;
    private _injector: Injector;

    constructor(injector: Injector) {
        super(injector);
        this._injector = injector;
        this.initConcurrentServiceRequests();
    }

    private initConcurrentServiceRequests(): void {
        const config = this._injector.get(LsAppConfig);
        this._allowConcurrentServiceRequests = config.allowConcurrentServiceRequests;
        if (!this._allowConcurrentServiceRequests) {
            this._serviceRequestQueue = new ServiceRequestQueue();
        }
    }

    public getData(params: DataServiceParams): Promise<UIResponse> {
        return this.handleRequest(this._httpClient.post, params);
    }

    public createData(params: DataServiceParams): Promise<UIResponse> {
        return this.handleRequest(this._httpClient.post, params);
    }

    public updateData(params: DataServiceParams): Promise<UIResponse> {
        return this.handleRequest(this._httpClient.post, params);
    }

    public deleteData(params: DataServiceParams): Promise<UIResponse> {
        return this.handleRequest(this._httpClient.post, params);
    }

    private handleRequest(method: HttpMethodType, params: DataServiceParams): Promise<UIResponse> {
        if (this._allowConcurrentServiceRequests) {
            return super.processRequest(method, params);
        } else {
            let onRequestComplete: Function;
            const responsePromise = new Promise<UIResponse>((resolve, reject) => {
                onRequestComplete = resolve;
            });
            this._serviceRequestQueue.queueRequest(new ServiceRequest(method, params, onRequestComplete));
            if (!this.processingRequests) {
                this.processNextRequest();
            }
            return responsePromise;
        }
    }

    private processNextRequest(): void {
        if (this._serviceRequestQueue.hasRequests()) {
            const request = this._serviceRequestQueue.getNextRequest();
            super.processRequest(request.method, request.params).then(result => {
                request.onComplete(result);
                this.processNextRequest();
            });
        }
    }

    protected createRequest(params: DataServiceParams): UIRequest {
        // create new data request
        const request = new UIRequest(params);
        // set session id for auth
        // request.sessionId = this.session.sessionId;
        return request;
    }

    protected getServiceUrl(request: UIRequest): string {
        return `${ServiceUrls.AppRootUrl}/${request.serviceInterface}/${request.serviceMethod}`;
    }

    protected processResponse(response: UIResponse): UIResponse {
        return response;
    }

    protected processErrors(response: any): void {
        const errorHandler = this._injector.get(ApplicationErrorFilter);
        errorHandler.processError(response.formattedErrors);
        if (errorHandler.hasCriticalError()) {
            this.criticalErrors = errorHandler.getCriticalErrors();
        }
    }

    protected processHttpErrors(response: HttpErrorResponse): void {
        const errorHandler = this._injector.get(HttpErrorFilter);
        if (response.status != HTTP_STATUS_OK) {
            errorHandler.processHttpError(response);
            this.criticalErrors = errorHandler.getCriticalErrors();
        }
    }
}
