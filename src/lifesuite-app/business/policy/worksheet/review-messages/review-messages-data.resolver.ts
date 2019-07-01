import { Injector, Injectable } from '@angular/core';

import { DataCollectionNames } from 'ls-core/model';
import { BasePolicyDataResolver } from 'business/policy/shared';
import { LazyLoadItemsRequest } from 'ls-core/util';
import { NTree } from 'ls-core/service/load-bypk';

@Injectable()
export class ReviewMessagesDataResolver extends BasePolicyDataResolver {
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
            insuredDTOLoadTree.AddChild(DataCollectionNames.ReviewMessages);
        }
        return insuredDTOLoadTree;
    }
}
