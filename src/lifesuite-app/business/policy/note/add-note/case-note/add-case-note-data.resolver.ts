import { Injector, Injectable } from '@angular/core';

import { DataCollectionNames } from 'ls-core/model';
import { LazyLoadItemsRequest } from 'ls-core/util';
import { NTree } from 'ls-core/service/load-bypk';
import { DirectDataResolverClass } from 'life-core/component/shared';
import { BasePolicyDataResolver } from 'business/policy/shared/data-resolver';

@Injectable()
export class AddCaseNoteDataResolver extends BasePolicyDataResolver implements DirectDataResolverClass<void> {
    constructor(injector: Injector) {
        super(injector);
    }

    protected loadLazyData(): Promise<any> {
        const request = new LazyLoadItemsRequest();
        request.addLazyLoadItems(this.policy, [
            DataCollectionNames.Agencies,
            DataCollectionNames.Agents,
            DataCollectionNames.Notes
        ]);
        request.addLazyLoadItem(this.policy, DataCollectionNames.Insureds, this.getInsuredLazyLoadTree());
        return this.lazyDataLoader.batchLoad(request);
    }

    private getInsuredLazyLoadTree(): NTree<string> {
        const insuredDTOLoadTree = new NTree<string>(DataCollectionNames.Insureds);
        {
            insuredDTOLoadTree.AddChildren([DataCollectionNames.Applications]);
        }
        return insuredDTOLoadTree;
    }
}
