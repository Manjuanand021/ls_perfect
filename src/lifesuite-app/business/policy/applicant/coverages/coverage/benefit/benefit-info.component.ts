import { Component, Injector } from '@angular/core';

import { ItemViewModel } from 'life-core/component/item-list';
import { ItemListAnimations } from 'life-core/component/item-list/animations/animations';

import { BenefitDTO, PolicyDTO } from 'ls-core/model';
import { AppSession } from 'ls-core/session';

import { AddBenefitListDataResolver } from './add-benefit/add-benefit-listdata.resolver';
import { ListDataUtil } from 'ls-core/service';

@Component({
    selector: 'benefit-info',
    templateUrl: './benefit-info.component.html',
    animations: ItemListAnimations
})
export class BenefitInfoComponent extends ItemViewModel<BenefitDTO> {
    public benefitName: string;
    public resolvedData: any;

    private _policy: PolicyDTO;
    private _benefitListDataResolver: AddBenefitListDataResolver;

    constructor(injector: Injector, appSession: AppSession, addBenefitListDataResolver: AddBenefitListDataResolver) {
        super(injector);
        this._policy = appSession.policyDTO;
        this._benefitListDataResolver = addBenefitListDataResolver;
    }

    public loadData(): Promise<void> {
        this.setResolvedListData();
        this.setBenefitName();
        return Promise.resolve();
    }

    private setBenefitName(): void {
        const coverage = this._policy.PolicyCoverages_LazyLoad.find(
            coverage => coverage.PolicyCoverageId === this.item.data.PolicyCoverageId
        );
        const listName = 'BenefitId_' + coverage.PlanCodeId;
        if (this.listData[listName]) {
            this.benefitName = ListDataUtil.getValueFromListDataById(
                this.listData[listName],
                this.item.data.BenefitId.toString()
            );
        } else {
            this._benefitListDataResolver.context = coverage;
            this._benefitListDataResolver.directResolve().then(data => {
                this.benefitName = ListDataUtil.getValueFromListDataById(
                    data.BenefitId,
                    this.item.data.BenefitId.toString()
                );
            });
        }
    }
}
