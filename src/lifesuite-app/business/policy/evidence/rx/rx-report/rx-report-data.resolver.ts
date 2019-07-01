import { Injector, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { BaseViewDataResolver } from 'ls-core/view-model';
import { DataServiceParams, UIServiceNames, UIServiceMethods } from 'ls-core/service';
import { InsuredDTO } from 'ls-core/model';
import { AppSession } from 'ls-core/session/app-session';
import { ApplicantListHelper } from 'business/policy/shared';
import { ConvertUtil } from 'life-core/util/lang';

@Injectable()
export class RxReportDataResolver extends BaseViewDataResolver {
    private _applicantListHelper: ApplicantListHelper;
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession, applicantListHelper: ApplicantListHelper) {
        super(injector);
        this._appSession = appSession;
        this._applicantListHelper = applicantListHelper;
    }

    protected getServiceParams(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): DataServiceParams {
        return new DataServiceParams({
            serviceInterface: UIServiceNames.RX_REPORT_PROXY_SERVICE,
            serviceMethod: UIServiceMethods.GET_DATA,
            requestPayload: new RxReportProxyRequest(ConvertUtil.toNumber(this.getActiveApplicant().PolicyPersonId))
        });
    }

    private getActiveApplicant(): InsuredDTO {
        return this._applicantListHelper.getActiveApplicantOrDefault(this._appSession.policyDTO.Insureds_LazyLoad);
    }
}

export class RxReportProxyRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.RXReportProxyRequest, LifeSuite.UIServiceDTO';

    public policyPersonId: number;

    constructor(policyPersonId: number) {
        this.policyPersonId = policyPersonId;
    }
}
