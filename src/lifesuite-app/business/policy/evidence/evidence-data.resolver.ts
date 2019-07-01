import { Injectable, Injector } from '@angular/core';

import { DataCollectionNames } from 'ls-core/model';
import { LazyLoadItemsRequest } from 'ls-core/util';
import { BasePolicyDataResolver } from 'business/policy/shared';
import { NTree } from 'ls-core/service/load-bypk';

@Injectable()
export class EvidenceDataResolver extends BasePolicyDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    protected loadLazyData(): Promise<any> {
        const request = new LazyLoadItemsRequest();
        request.addLazyLoadItem(this.policy, DataCollectionNames.Insureds, this.getLazyLoadTree());
        return this.lazyDataLoader.load(request);
    }

    private getLazyLoadTree(): NTree<string> {
        const insuredDTOLoadTree = new NTree<string>(DataCollectionNames.Insureds);
        {
            insuredDTOLoadTree.AddChildren([
                DataCollectionNames.Medication,
                DataCollectionNames.MIBCoding,
                DataCollectionNames.Velogicas
            ]);
        }
        return insuredDTOLoadTree;
    }
}
