import { Injector, Injectable } from '@angular/core';
import { DataServiceParams, UIServiceNames, UIServiceMethods, DataService } from 'ls-core/service';
import { MIBCodingDTO } from 'ls-core/model';

@Injectable()
export class MIBCodingService {
    private _dataService: DataService;

    constructor(dataService: DataService) {
        this._dataService = dataService;
    }

    public submitMIBCodings(
        policyID: number,
        policyPersonId: number,
        codes: MIBCodingDTO[]
    ): Promise<MibCodingSubmitResponse> {
        const serviceParams = this.getSubmitCodesServiceParams(policyID, policyPersonId, codes);
        return this.invokeService(serviceParams);
    }

    public validateMIBCodes(
        policyID: number,
        policyPersonId: number,
        codes: MIBCodingDTO[]
    ): Promise<MibCodingSubmitResponse> {
        const serviceParams = this.getValidateCodesServiceParams(policyID, policyPersonId, codes);
        return this.invokeService(serviceParams);
    }

    private invokeService(serviceParams: DataServiceParams): Promise<MibCodingSubmitResponse> {
        return this._dataService.updateData(serviceParams).then(response => {
            return response && response.responsePayload ? (response.responsePayload as MibCodingSubmitResponse) : null;
        });
    }

    private getSubmitCodesServiceParams(
        policyID: number,
        policyPersonId: number,
        codes: MIBCodingDTO[]
    ): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.MIB_CODINGS,
            serviceMethod: UIServiceMethods.SUBMIT_CODES,
            requestPayload: this.buildRequestPayload(policyID, policyPersonId, codes)
        });
    }

    private getValidateCodesServiceParams(
        policyID: number,
        policyPersonId: number,
        codes: MIBCodingDTO[]
    ): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.MIB_CODINGS,
            serviceMethod: UIServiceMethods.VALIDATE_MIB_CODES,
            requestPayload: this.buildRequestPayload(policyID, policyPersonId, codes)
        });
    }

    private buildRequestPayload(
        policyID: number,
        policyPersonId: number,
        codes: MIBCodingDTO[]
    ): MibCodingSubmitRequest {
        const request = new MibCodingSubmitRequest();
        request._policyID = policyID;
        request._insuredID = policyPersonId;
        request._mibCodindCollection = codes;
        return request;
    }
}

class MibCodingSubmitRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.MibCodingSubmitRequest, LifeSuite.UIServiceDTO';
    public _mibCodindCollection: MIBCodingDTO[];
    public _policyID: number;
    public _insuredID: number;
}

export class MibCodingSubmitResponse {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.MibCodingSubmitResponse, LifeSuite.UIServiceDTO';
    public _totalCodesSubmitted: number;
    public _errorMessage: string;
}
