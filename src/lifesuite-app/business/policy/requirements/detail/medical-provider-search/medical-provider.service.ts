import { Injector, Injectable } from '@angular/core';
import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';
import { MedicalProviderProxyDTO } from 'ls-core/model';

@Injectable()
export class MedicalProviderService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    private getServiceParams(parameterList: string[]): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.REQUIREMENT_MEDICALPROVIDER_SEARCH,
            serviceMethod: UIServiceMethods.GET_MEDICAL_PROVIDER_LIST,
            requestPayload: this.buildMIBCodingsSubmitRequest(parameterList)
        });
    }

    private buildMIBCodingsSubmitRequest(parameterList: string[]): RequirementMedicalProviderSearchRequest {
        const request = new RequirementMedicalProviderSearchRequest();
        request.parametersList = parameterList;
        return request;
    }

    public fetchMedicalProviderList(parameterList: string[]): Promise<MedicalProviderProxyDTO[]> {
        const serviceParams = this.getServiceParams(parameterList);
        return this._dataService
            .getData(serviceParams)
            .then(response => {
                return response.responsePayload ? (response.responsePayload as MedicalProviderProxyDTO[]) : [];
            })
            .catch(response => {
                return [];
            });
    }
}

class RequirementMedicalProviderSearchRequest {
    public readonly $type: string =
        'life.ls.ui.ria.dto.requests.RequirementMedicalProviderSearchRequest, LifeSuite.UIServiceDTO';
    public parametersList: string[];
}
