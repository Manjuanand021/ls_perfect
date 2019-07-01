import { Injectable, Injector } from '@angular/core';

import { BenefitDTO, PolicyCoverageDTO, ReinsurerDTO, CoverageDTO, InsuredDTO, PolicyDTO } from 'ls-core/model';
import { BaseListDataResolver } from 'ls-core/view-model';
import { ListsDataRequest, ListDataRequestBuilder } from 'ls-core/service';
import { AppSession } from 'ls-core/session';
import { ObjectUtil } from 'life-core/util/lang';
import { CollectionUtil } from 'life-core/util';

@Injectable()
export class CaseDispositionListDataResolver extends BaseListDataResolver {
    private _appSession: AppSession;

    constructor(injector: Injector, appSession: AppSession) {
        super(injector);
        this._appSession = appSession;
    }

    protected getListsDataRequest(): ListsDataRequest {
        const listDataRequestBuilder = new ListDataRequestBuilder();
        listDataRequestBuilder.setRootDTO(this.policy);
        listDataRequestBuilder.addListRequestItem(this.policy, 'ReinsuranceVendorCode');
        this.addCoverageStatusDataListRequestItems(listDataRequestBuilder);
        this.addReinsurerListDataRequest(listDataRequestBuilder);
        // Other Sections
        // ...

        return listDataRequestBuilder.getRequest();
    }

    private addCoverageStatusDataListRequestItems(listDataRequestBuilder: ListDataRequestBuilder): void {
        const policyCoverage = ObjectUtil.createObjectOfType<PolicyCoverageDTO>(
            this.policy.PolicyCoverages_LazyLoad,
            PolicyCoverageDTO
        ) as PolicyCoverageDTO;
        const benefit = ObjectUtil.createObjectOfType<BenefitDTO>(
            policyCoverage.Benefits_LazyLoad,
            BenefitDTO
        ) as BenefitDTO;
        listDataRequestBuilder.addListRequestItem(benefit, 'CoverageStatus');
    }

    private addReinsurerListDataRequest(listDataRequestBuilder: ListDataRequestBuilder): void {
        let insured: InsuredDTO;
        let coverageDTO: CoverageDTO;
        const insureds = this.policy.Insureds_LazyLoad;
        if (insureds && insureds.length > 0) {
            insured = insureds[0];
            CollectionUtil.addItemIfCollectionEmpty<CoverageDTO>(insured.Coverages_LazyLoad, CoverageDTO);
            coverageDTO = insured.Coverages_LazyLoad[0];
        }
        const reinsurerDTO = new ReinsurerDTO();
        listDataRequestBuilder.addListRequestItem(reinsurerDTO, 'Reinsurer');
        listDataRequestBuilder.addListRequestItem(coverageDTO, 'PermTableRating');
        listDataRequestBuilder.addListRequestItem(coverageDTO, 'RateClassApproved');
    }

    private get policy(): PolicyDTO {
        return this._appSession.policyDTO;
    }
}
