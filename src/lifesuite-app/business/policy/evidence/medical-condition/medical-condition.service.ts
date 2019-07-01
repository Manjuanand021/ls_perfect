import { Injector, Injectable } from '@angular/core';
import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';
import { MedicalConditionDTO } from 'ls-core/model';

@Injectable()
export class MedicalConditionService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    private getServiceParams(medicalConditionDTO: MedicalConditionDTO): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.MEDCON_LIST_GET,
            serviceMethod: UIServiceMethods.MEDCON_LIST_GET,
            requestPayload: this.buildRequest(medicalConditionDTO)
        });
    }

    private buildRequest(medicalConditionDTO: MedicalConditionDTO): MedicalConditionGetRequest {
        const request = new MedicalConditionGetRequest();
        request.medicalConditionDTO = medicalConditionDTO;
        return request;
    }

    public getMedicalConditionList(medicalConditionDTO: MedicalConditionDTO): Promise<MedicalConditionGetResponse> {
        const serviceParams = this.getServiceParams(medicalConditionDTO);
        return this._dataService.getData(serviceParams).then(response => {
            return <MedicalConditionGetResponse>response.responsePayload;
        });
    }
}

class MedicalConditionGetRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.MedicalConditionGetRequest, LifeSuite.UIServiceDTO';
    public medicalConditionDTO: MedicalConditionDTO;
}

class MedicalConditionGetResponse {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.MedicalConditionGetResponse, LifeSuite.UIServiceDTO';
    public objectList: MedicalConditionDTO[];
}
