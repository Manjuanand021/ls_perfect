import { Injector, Injectable } from '@angular/core';
import { ConvertUtil } from 'life-core/util/lang';
import { BaseViewDataResolver } from 'ls-core/view-model';
import { AppSession } from 'ls-core/session';
import { UIServiceNames, UIServiceMethods, DataServiceParams } from 'ls-core/service';
import { ScratchPadDTO } from 'ls-core/model';
import { ScratchPadRequest } from './scratch-pad.request';

@Injectable()
export class ScratchPadDataResolver extends BaseViewDataResolver {
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    protected getServiceParams(): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.SCRATCH_PAD_SERVICE,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: this.getRequestPayload()
        });
    }

    private getRequestPayload(scratchPadDTO?: ScratchPadDTO): ScratchPadRequest {
        const requestPayload = new ScratchPadRequest();
        requestPayload.policyId = ConvertUtil.toNumber(this._appSession.policyDTO.PolicyId);
        return requestPayload;
    }
}
