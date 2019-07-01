import { Injector, Injectable } from '@angular/core';
import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';
import { MedicationDTO } from 'ls-core/model';

@Injectable()
export class OtherMedicationService {
    private _dataService: DataService;

    constructor(injector: Injector, dataService: DataService) {
        this._dataService = dataService;
    }

    private getServiceParams(medicationDTO: MedicationDTO): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.MED_LIST_GET,
            serviceMethod: UIServiceMethods.MED_LIST_GET,
            requestPayload: this.buildRequest(medicationDTO)
        });
    }

    private buildRequest(medicationDTO: MedicationDTO): MedicationGetRequest {
        const request = new MedicationGetRequest();
        request.medicationDTO = medicationDTO;
        return request;
    }

    public getMedicationList(medicationDTO: MedicationDTO): Promise<MedicationGetResponse> {
        const serviceParams = this.getServiceParams(medicationDTO);
        return this._dataService.getData(serviceParams).then(response => {
            return <MedicationGetResponse>response.responsePayload;
        });
    }
}

class MedicationGetRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.MedicationGetRequest, LifeSuite.UIServiceDTO';
    public medicationDTO: MedicationDTO;
}

class MedicationGetResponse {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.MedicationGetResponse, LifeSuite.UIServiceDTO';
    public objectList: MedicationDTO[];
}
