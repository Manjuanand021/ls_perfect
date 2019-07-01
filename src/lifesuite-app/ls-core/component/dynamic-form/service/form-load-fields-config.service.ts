import { Injectable } from '@angular/core';

import { DataService, DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { FieldConfig } from 'life-core/component/dynamic-form';

/**
 *  Loads Field configurations for Dynamic Forms
 */
@Injectable({
    providedIn: 'root'
})
export class FormLoadFieldsConfigService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public load(formType: string): Promise<Array<FieldConfig>> {
        const serviceParams = this.getServiceParams(formType);
        return this._dataService.getData(serviceParams).then(response => {
            return response.responsePayload as FieldConfig[];
        });
    }

    private getServiceParams(formType: string): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.FORM_FIELDS,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: this.getPayload(formType)
        });
    }

    private getPayload(formType: string): FormFieldsRequestDTO {
        return new FormFieldsRequestDTO(formType);
    }
}

export class FormFieldsRequestDTO {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.FormFieldsRequestDTO, LifeSuite.UIServiceDTO';
    public formType: string;

    constructor(formType: string) {
        this.formType = formType;
    }
}
