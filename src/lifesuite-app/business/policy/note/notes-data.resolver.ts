import { Injector, Injectable } from '@angular/core';

import { DataCollectionNames, PolicyDTO } from 'ls-core/model';
import { LazyLoadItemsRequest } from 'ls-core/util';
import { BasePolicyDataResolver } from 'business/policy/shared/data-resolver';

@Injectable()
export class NotesDataResolver extends BasePolicyDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    protected loadLazyData(): Promise<any> {
        const policy = this.resolvedData as PolicyDTO;
        const request = new LazyLoadItemsRequest();
        request.addLazyLoadItem(policy, DataCollectionNames.Insureds);
        request.addLazyLoadItem(policy, DataCollectionNames.Notes);
        return this.lazyDataLoader.batchLoad(request);
    }
}
