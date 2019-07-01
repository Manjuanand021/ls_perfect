import { BaseDataServiceParams } from 'life-core/service';

export class DataServiceParams extends BaseDataServiceParams {
    public serviceInterface: string;
    public serviceMethod: string;
    public requestPayload: Object;

    constructor({
        serviceInterface,
        serviceMethod,
        requestPayload,
        nonBlocking
    }: {
        serviceInterface?: string;
        serviceMethod?: string;
        requestPayload?: Object;
        nonBlocking?: boolean;
    }) {
        super({
            nonBlocking: nonBlocking
        });
        this.serviceInterface = serviceInterface;
        this.serviceMethod = serviceMethod;
        this.requestPayload = requestPayload;
    }
}

/**
 * LifeSuite request and response classes
 */

export interface IUIRequest {
    serviceInterface: string;
    serviceMethod: string;
    requestPayload: Object;
}

export class UIRequest implements IUIRequest {
    public serviceInterface: string;
    public serviceMethod: string;
    public requestPayload: Object;

    constructor({
        serviceInterface,
        serviceMethod,
        requestPayload
    }: {
        serviceInterface: string;
        serviceMethod: string;
        requestPayload: Object;
    }) {
        this.serviceInterface = serviceInterface;
        this.serviceMethod = serviceMethod;
        this.requestPayload = requestPayload;
    }
}

export interface IUIResponse {
    responsePayload: Object;
    formattedErrors: IIPObjectError[];
    ValidationResultList: Object[];
}

export class UIResponse implements IUIResponse {
    public responsePayload: Object;
    public formattedErrors: IIPObjectError[];
    public ValidationResultList: Object[];
}

export class IIPObjectError {
    public objectName: string;
    public methodName: string;
    public objectId: string;
    public formattedMessage: string;
    public severityLevel: number;
    public errorCodes: string[];
    public errorType: number;
    public date: Date;
}
