import { Injectable, Injector } from '@angular/core';

import { BaseDataService } from 'life-core/service';
import { Session } from 'life-core/session/session';
import { DataServiceParams, DataRequest, DataResponse, RawDataResponse, ResponseMessage } from './data-service.model';
import { ServiceUrls } from './service-urls';

/**
 * Generic JSON data service implementation.
 */
@Injectable()
export class DataService extends BaseDataService<DataResponse> {
    protected session: Session;

    constructor(injector: Injector) {
        super(injector);
        this.session = injector.get(Session);
    }

    public getData(params: DataServiceParams): Promise<DataResponse> {
        return this.processRequest(this._httpClient.post, params);
    }

    public createData(params: DataServiceParams): Promise<DataResponse> {
        return this.processRequest(this._httpClient.post, params);
    }

    public updateData(params: DataServiceParams): Promise<DataResponse> {
        return this.processRequest(this._httpClient.post, params);
    }

    public deleteData(params: DataServiceParams): Promise<DataResponse> {
        return this.processRequest(this._httpClient.delete, params);
    }

    /**
     * Creates new data service request.
     */
    protected createRequest(params: DataServiceParams): DataRequest {
        // create new data request
        let request = new DataRequest(params);
        // set session id for auth
        request.sessionId = this.session.sessionId;
        return request;
    }

    protected getServiceUrl(request: any): string {
        //return AppUtils.AppRootUrl;
        return ServiceUrls.AppRootUrl;
    }

    /**
     * Processes service response and creates
     * generic data response object instance.
     */
    protected processResponse(response: RawDataResponse): DataResponse {
        let dataResponse: DataResponse = new DataResponse();
        dataResponse.sessionId = response.sessionId;
        dataResponse.templateResponseList = response.templateResponseList;
        dataResponse.data = response.payLoad;
        if (response.formattedErrors) {
            dataResponse.messages = [];
            for (let err of response.formattedErrors) {
                dataResponse.messages.push(new ResponseMessage(err));
            }
        }
        //this.logger.debug(dataResponse);
        return dataResponse;
    }

    /**
     * Logs service response errors.
     *
     * @param errors error list.
     */
    processErrors(response: any) {
        if (response && response.messages) {
            //this._logger.error(response.messages);
            console.log('RESPONSE ERRORS');
            console.dir(response.messages);
        }
    }

    protected processHttpErrors(response: any) {
        if (response && response.messages) {
            //this._logger.error(response.messages);
            console.log('RESPONSE ERRORS');
            console.dir(response.messages);
        }
    }
}
