import { HttpMethodType } from 'life-core/service';
import { ObjectUtil } from 'life-core/util/lang/object.util';
import { DataServiceParams } from './data-service.model';

export class ServiceRequestQueue {
    private _serviceRequests: Array<ServiceRequest> = [];

    public hasRequests(): boolean {
        return this._serviceRequests.length > 0;
    }

    public getNextRequest(): ServiceRequest {
        return this._serviceRequests.shift();
    }

    public queueRequest(request: ServiceRequest): void {
        this._serviceRequests.push(request);
    }
}

export class ServiceRequest {
    public method: HttpMethodType;
    public params: DataServiceParams;
    public onComplete: Function;

    constructor(method: HttpMethodType, params: DataServiceParams, onComplete: Function) {
        this.method = method;
        // Need to preserve request data because request's root object
        // may change by the time request is ready to be processed.
        // This is a side-effect of the service being a singleton object
        // injected into multiple instances of the same component
        // which holds reference to the root of the request data object.
        this.params = ObjectUtil.deepCopy(params);
        this.onComplete = onComplete;
    }
}
