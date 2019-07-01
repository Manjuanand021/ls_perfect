import { Injector, Injectable } from '@angular/core';

import { LazyLoadItemsRequest } from 'ls-core/util';
import { DataCollectionNames, PolicyDTO } from 'ls-core/model';
import { NTree } from 'ls-core/service/load-bypk';

import { BasePolicyDataResolver } from './base-policy-data.resolver';

@Injectable()
export class TabPolicyDataResolver extends BasePolicyDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    // need these collections to be lazy loaded for policy quick info panel component
    protected loadLazyData(): Promise<any> {
        const request = new LazyLoadItemsRequest();
        const policy = this.resolvedData as PolicyDTO;
        request.addLazyLoadItem(policy, DataCollectionNames.Insureds, this.getInsuredLazyLoadTree());
        request.addLazyLoadItem(policy, DataCollectionNames.Agents, this.getAgentLazyLoadTree());
        request.addLazyLoadItem(policy, DataCollectionNames.Agencies);
        request.addLazyLoadItem(policy, DataCollectionNames.Requirements);
        return this.lazyDataLoader.batchLoad(request);
    }

    private getInsuredLazyLoadTree(): NTree<string> {
        const insuredDTOLoadTree = new NTree<string>(DataCollectionNames.Insureds);
        {
            const coveragesNode = insuredDTOLoadTree.AddChildren([DataCollectionNames.Coverages]);
        }
        return insuredDTOLoadTree;
    }

    private getAgentLazyLoadTree(): NTree<string> {
        const agentDTOLoadTree = new NTree<string>(DataCollectionNames.Agents);
        {
            const phonesNode = agentDTOLoadTree.AddChildren([DataCollectionNames.Phones]);
        }
        return agentDTOLoadTree;
    }
}
