import { Injectable } from '@angular/core';
import { ConvertUtil } from 'life-core/util/lang';
import { ILogger, Logger } from 'life-core/logging';
import { DataService, DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { ScratchPadDTO } from 'ls-core/model';
import { AppSession } from 'ls-core/session';
import { DBDateUtil } from 'ls-core/util';
import { ScratchPadRequest } from './scratch-pad.request';

@Injectable()
export class ScratchPadDataService {
    private _appSession: AppSession;
    private _dataService: DataService;
    private _logger: ILogger;

    constructor(dataService: DataService, appSession: AppSession, logger: Logger) {
        this._dataService = dataService;
        this._appSession = appSession;
        this._logger = logger;
    }

    public updateScratchPad(scratchPadDTO: ScratchPadDTO): Promise<void> {
        const serviceParams = this.getServiceParams(scratchPadDTO);
        return this._dataService.updateData(serviceParams).then(response => {
            // Below is temporary, it is used to check response. In future it will be removed.
            if (response.responsePayload) {
                this._logger.log('Scratch Pad data saved successfully.');
            } else {
                this._logger.log('Scratch Pad data save unsuccessful.');
            }
        });
    }
    private getServiceParams(scratchPadDTO: ScratchPadDTO): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.SCRATCH_PAD_SERVICE,
            serviceMethod: UIServiceMethods.SET_DATA,
            requestPayload: this.getRequestPayload(scratchPadDTO)
        });
    }

    private getRequestPayload(scratchPadDTO: ScratchPadDTO): ScratchPadRequest {
        const requestPayload = new ScratchPadRequest();
        requestPayload.policyId = ConvertUtil.toNumber(this._appSession.policyDTO.PolicyId);
        requestPayload.scratchPadDTO = this.createScratchPadDTO(scratchPadDTO);
        return requestPayload;
    }

    private createScratchPadDTO(scratchPadDTO: ScratchPadDTO): ScratchPadDTO {
        // If there is no AddedBy/AddedDate other also shouldn't be present.
        if (!scratchPadDTO.AddedBy || !scratchPadDTO.AddedDate) {
            scratchPadDTO.AddedBy = this._appSession.user.UserId;
            scratchPadDTO.AddedDate = DBDateUtil.dateToDBDate(new Date());
        } else {
            scratchPadDTO.UpdatedBy = this._appSession.user.UserId;
            scratchPadDTO.UpdatedDate = DBDateUtil.dateToDBDate(new Date());
        }
        return scratchPadDTO;
    }
}
