import { WebServiceAndMethodIds } from './web-service-method-ids';
import {FieldDescriptorBase} from 'lpla-core/field/field-descriptor.model';


/**
* Service interface.
*/
export class ServiceInformation {
    serviceId: string;
    methodId: string;
    webServiceId: string;
    webMethodId: string;
}

/**
* Service parameters.
*/
export class DataServiceParams extends ServiceInformation {
    targetPageId: string;
    data: any;
    fieldsData: any;
    onError: Function;
    onMessages: Function;
    navigationActionId: number;
	nonBlocking: boolean;

    constructor({webServiceId = WebServiceAndMethodIds.BaseBusinessDataService,
                webMethodId = WebServiceAndMethodIds.BaseBusinessDataMethod,
                serviceId, methodId, targetPageId, data, fieldsData, 
				navigationActionId, nonBlocking = false}: {
            webServiceId?: string;
            webMethodId?: string;
            serviceId?: string;
            methodId?: string;
            targetPageId?: string;
            data?: any;
            fieldsData?: any;
            navigationActionId?: number;
			nonBlocking?: boolean;
    }) {
            super();
            this.webServiceId = webServiceId;
            this.webMethodId = webMethodId;
            this.serviceId = serviceId;
            this.methodId = methodId;
            this.targetPageId = targetPageId;
            this.data = data;
            this.fieldsData = fieldsData;
            this.navigationActionId = navigationActionId;
			this.nonBlocking = 	nonBlocking;
    }
}

/**
* Defines generic app data request interface.
*/
export interface IRequest {
    currentPageId: string; // input processor
    targetPageId: string, // output processor
    serviceId: string;
    methodId: string;
    webServiceId: string;
    webMethodId: string;
    serverViewResolver: string, // html view resolver
    payLoad: Object; // json request data
    navigationActionId: number, // nav enum
    cacheable: boolean, // cache on th the client
    bypassTemplateLoad: boolean, // skip template
    linkedToNavigationPath: string, // left nav link???
    checkReregisterRootObjects: number //
    nonBlocking: boolean, // non-blocking UI
    messagingDetails: Object // signal R
}

/**
 * Generic Life app data request implementation.
 */
export class DataRequest extends ServiceInformation implements IRequest {

    sessionId: string;
    currentPageId: string;
    targetPageId: string = '';
    serverViewResolver: string = null;
    payLoad: Object;
    fieldsData: any;
    navigationActionId: number = 0;
    cacheable: boolean = false;
    bypassTemplateLoad: boolean = false;
    linkedToNavigationPath: string = null;
    checkReregisterRootObjects: number = 0;
    nonBlocking: boolean = false;
    messagingDetails: Object = null;

	/**
	* Creates new data request.
	*
	* @param serviceUrl - service url.
	* @param data - request data content.
	*/
    constructor(params: DataServiceParams) {

        super();

        this.currentPageId = params.targetPageId;
        this.targetPageId = params.targetPageId;
        this.payLoad = params.data;
        this.fieldsData = params.fieldsData;
        this.navigationActionId = params.navigationActionId;
        this.serviceId = params.serviceId;
        this.methodId = params.methodId;
        this.webServiceId = params.webServiceId;
        this.webMethodId = params.webMethodId;
    }
}

/**
* Defines generic app data response interface.
*/
export interface IResponse {
    $type: string;
    sessionId: string;
    messages: any;
    templateResponseList: any;
    data: any;
}

/**
 * Generic data response implementation.
 */
export class DataResponse implements IResponse {
    $type: string;
    sessionId: string;
    messages: ResponseMessage[];
    templateResponseList: TemplateResponse[];
    data: any;

	/**
	* Checks for messages to display, if any.
	*/
    public get hasMessages(): boolean {
        return this.messages && this.messages.length > 0;
    }

}

export class RawDataResponse {
    sessionId: string;
    payLoad: Object;
    formattedErrors: Object[];
    templateResponseList: Array<TemplateResponse>;
}

export class ResponseMessage {
    text: string;
    title: string;
    errorCode: string;
    errorId: string;

    constructor(err: any) {
        this.text = err.formattedMessage;
        this.title = err.formattedTitle;
        this.errorCode = err.errorCode;
        this.errorId = err.errorId;
    }
}

export class TemplateResponse {
    htmlText: string;
    fieldsData: Array<FieldDescriptorBase>
    securedUIElements: Object[];
    viewId: string;
}
