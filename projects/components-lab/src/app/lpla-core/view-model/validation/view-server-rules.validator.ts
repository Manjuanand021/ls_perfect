import { Injectable} from '@angular/core';

import {DataService, DataServiceParams, DataResponse} from 'lpla-core/service';
import {ValidationRequest} from './validation.request';
import {ViewValidationParams} from './view-data.validator';

@Injectable()
export class ViewServerRulesValidator implements IViewServerRulesValidator {

    static ValidationUrlPostfix: string = "/validate";

    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public validate(viewId: string, viewValidationParams: ViewValidationParams, data: any): Promise<DataResponse> {
        return this.getValidationResponse(viewId, viewValidationParams, data);
    }

    private getValidationResponse(currentPageId: string, viewValidationParams: ViewValidationParams, data: any): Promise<DataResponse> {
        let params = this.packageServiceParams(currentPageId, viewValidationParams, data);
        return this._dataService.getData(params);
    }

    private packageServiceParams(currentPageId: string, viewValidationParams: ViewValidationParams, data: any): DataServiceParams {
        var params = new DataServiceParams(
            {
                targetPageId: currentPageId + ViewServerRulesValidator.ValidationUrlPostfix,
                serviceId: viewValidationParams.serviceId,
                methodId: viewValidationParams.methodId,
                data: data
            }
        );
        return params;
    }
}

export interface IViewServerRulesValidator {
    validate(viewId: string, viewValidationParams: ViewValidationParams, data: any): Promise<DataResponse>;
}