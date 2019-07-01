import { Injectable, Injector } from '@angular/core';

import { DataCollectionNames, BenefitDTO } from 'ls-core/model';
import { LazyLoadItemsRequest } from 'ls-core/util';
import { BasePolicyDataResolver } from 'business/policy/shared';

@Injectable()
export class AddBenefitDataResolver extends BasePolicyDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    protected loadLazyData(): Promise<any> {
        const benefit = new BenefitDTO();
        const request = new LazyLoadItemsRequest();
        request.addLazyLoadItem(benefit, DataCollectionNames.BenefitParties);
        return this.lazyDataLoader.load(request);
    }
}
