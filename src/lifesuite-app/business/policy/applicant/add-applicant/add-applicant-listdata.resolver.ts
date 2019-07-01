import { Injectable, Injector } from '@angular/core';

import { InsuredDTO, CoverageDTO, PolicyDTO } from 'ls-core/model';
import { BaseListDataResolver } from 'ls-core/view-model';
import { ListsDataRequest, ListDataRequestBuilder } from 'ls-core/service';
import { AppSession } from 'ls-core/session';
import { ObjectUtil } from 'life-core/util/lang';

import { ApplicantListHelper } from 'business/policy/shared';

@Injectable()
export class AddApplicantListDataResolver extends BaseListDataResolver {
    private _applicantListHelper: ApplicantListHelper;
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession, applicantListHelper: ApplicantListHelper) {
        super(injector);
        this._applicantListHelper = applicantListHelper;
        this._appSession = appSession;
    }

    protected getListsDataRequest(): ListsDataRequest {
        const applicant = ObjectUtil.createObjectOfType<InsuredDTO>(
            this.getActiveApplicant(),
            InsuredDTO
        ) as InsuredDTO;
        const coverage = ObjectUtil.createObjectOfType<CoverageDTO>(
            applicant.Coverages_LazyLoad[0],
            CoverageDTO
        ) as CoverageDTO;
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this.policy);
        listDataRequestBuilder.addListRequestItem(applicant, 'Title');
        listDataRequestBuilder.addListRequestItem(applicant, 'Suffix');
        listDataRequestBuilder.addListRequestItem(applicant, 'Sex');
        listDataRequestBuilder.addListRequestItem(applicant, 'RelationshipToInsured');
        listDataRequestBuilder.addListRequestItem(coverage, 'PlanCodeId');

        return listDataRequestBuilder.getRequest();
    }

    private getActiveApplicant(): InsuredDTO {
        return this._applicantListHelper.getActiveApplicantOrDefault(this.policy.Insureds_LazyLoad) as InsuredDTO;
    }

    private get policy(): PolicyDTO {
        return this._appSession.policyDTO;
    }
}
