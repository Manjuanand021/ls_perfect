import { Injectable, Injector } from '@angular/core';

import { DataService } from './data.service';
import { DataServiceParams, DataRequest, DataResponse } from './data-service.model';
import { WebServiceAndMethodIds } from './web-service-method-ids';
import { FieldDescriptorBase } from 'lpla-core/field/field-descriptor.model';
import { environment } from '../../../environments';
import { EnvironmentTypes } from 'environments/environment-types';

/**
 * Defines view data service for getting view data,
 * data binding, field dependencies, and input validation rules.
 */
@Injectable()
export class ViewDataService extends DataService {
    /**
     * Creates new view data service instance.
     */
    constructor(container: Injector) {
        super(container);
    }

    /**
     * Processes view data request.
     *
     * @param viewPath View path for the view data request.
     */
    getFieldsData(fieldDataFileUrl: string, serviceId: string, methodId: string, payload: any): Promise<DataResponse> {
        // create view data config request url
        let dataConfigUrl: string = this.getDataConfigUrl(fieldDataFileUrl);

        // serviceUrl = "core/fieldsDataRetrieval";
        let params: DataServiceParams = this.packageServiceParams(dataConfigUrl, serviceId, methodId, payload);

        // process view data request
        return this.getData(params);
    }

    getDataConfigUrl(fieldDataFileUrl: string): string {
        let path = `app/${fieldDataFileUrl}`;
        let location = environment.type == EnvironmentTypes.PROD ? 'dist/dat' : 'src';
        return `${location}/${path}`;
    }

    private packageServiceParams(
        dataConfigUrl: string,
        serviceId: string,
        methodId: string,
        payload: any
    ): DataServiceParams {
        var params = new DataServiceParams({
            targetPageId: dataConfigUrl,
            serviceId: serviceId,
            methodId: methodId,
            webServiceId: WebServiceAndMethodIds.BaseTemplateDataBusinessInputDataService,
            webMethodId: WebServiceAndMethodIds.BaseBusinessDataMethod,
            data: payload
        });
        return params;
    }

    /**
     * Creates new view data service request.
     */
    createRequest(params: DataServiceParams): DataRequest {
        let request = super.createRequest(params);
        request.currentPageId = ''; // must be empty for data service calls
        return request;
    }

    /**
     * Processes view data service response and creates
     * generic data array for UI data binding.
     */
    processResponse(response): any {
        // get generic response data
        let dataResponse: DataResponse = super.processResponse(response);

        if (response.templateResponseList !== undefined && response.templateResponseList.length > 0) {
            // get view data
            let data: FieldDescriptorBase[] = response.templateResponseList[0].fieldsData;

            dataResponse.data = data;

            // log view data for debug
            //this.logger.debug(data);
        }

        // generic data service response with error messages and UI data list
        return dataResponse;
    }
}
