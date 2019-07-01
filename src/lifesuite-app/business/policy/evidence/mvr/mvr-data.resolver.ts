import { Injector, Injectable } from '@angular/core';

import { DataCollectionNames } from 'ls-core/model';
import { LazyLoadItemsRequest } from 'ls-core/util';
import { NTree } from 'ls-core/service/load-bypk';
import { BasePolicyDataResolver } from 'business/policy/shared';

@Injectable()
export class MVRDataResolver extends BasePolicyDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    protected loadLazyData(): Promise<any> {
        const request = new LazyLoadItemsRequest();
        request.addLazyLoadItem(this.policy, DataCollectionNames.Insureds, this.getMVRLazyLoadTree());
        return this.lazyDataLoader.load(request);
    }

    private getMVRLazyLoadTree(): NTree<string> {
        const insuredDTOLoadTree = new NTree<string>(DataCollectionNames.Insureds);
        {
            const mvrDTOLoadNode = insuredDTOLoadTree.AddChild(DataCollectionNames.MVRs);
            {
                mvrDTOLoadNode.AddChild(DataCollectionNames.MVRDetails);
            }
        }

        return insuredDTOLoadTree;
    }
}
