import { Injector, Injectable } from '@angular/core';

import { NTree } from 'ls-core/service/load-bypk';
import { DataCollectionNames } from 'ls-core/model';
import { BasePolicyDataResolver } from 'business/policy/shared';
import { LazyLoadItemsRequest } from 'ls-core/util';

@Injectable()
export class CaseDataResolver extends BasePolicyDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    protected loadLazyData(): Promise<any> {
        const request = new LazyLoadItemsRequest();
        request.addLazyLoadItem(this.policy, DataCollectionNames.Owners, this.getOwnerLazyLoadTree());
        request.addLazyLoadItem(this.policy, DataCollectionNames.Insureds, this.getInsuredLazyLoadTree());
        request.addLazyLoadItem(this.policy, DataCollectionNames.Payors, this.getPayorLazyLoadTree());
        request.addLazyLoadItem(this.policy, DataCollectionNames.Agencies, this.getAgencyLazyLoadTree());
        request.addLazyLoadItem(this.policy, DataCollectionNames.Agents, this.getAgentLazyLoadTree());
        return this.lazyDataLoader.batchLoad(request);
    }

    private getOwnerLazyLoadTree(): NTree<string> {
        const ownerDTOLoadTree = new NTree<string>(DataCollectionNames.Owners);
        {
            ownerDTOLoadTree.AddChild(DataCollectionNames.Addresses);
            ownerDTOLoadTree.AddChild(DataCollectionNames.Phones);
        }
        return ownerDTOLoadTree;
    }

    private getInsuredLazyLoadTree(): NTree<string> {
        const insuredDTOLoadTree = new NTree<string>(DataCollectionNames.Insureds);
        {
            insuredDTOLoadTree.AddChildren([
                DataCollectionNames.Addresses,
                DataCollectionNames.Applications,
                DataCollectionNames.Phones
            ]);
        }
        return insuredDTOLoadTree;
    }

    private getPayorLazyLoadTree(): NTree<string> {
        const payorDTOLoadTree = new NTree<string>(DataCollectionNames.Payors);
        {
            payorDTOLoadTree.AddChild(DataCollectionNames.Addresses);
        }
        return payorDTOLoadTree;
    }
    private getAgencyLazyLoadTree(): NTree<string> {
        const agecnyDTOLoadTree = new NTree<string>(DataCollectionNames.Agencies);
        {
            agecnyDTOLoadTree.AddChild(DataCollectionNames.Addresses);
            agecnyDTOLoadTree.AddChild(DataCollectionNames.Phones);
            agecnyDTOLoadTree.AddChild(DataCollectionNames.Relations);
        }
        return agecnyDTOLoadTree;
    }
    private getAgentLazyLoadTree(): NTree<string> {
        const agentDTOLoadTree = new NTree<string>(DataCollectionNames.Agents);
        {
            agentDTOLoadTree.AddChildren([
                DataCollectionNames.Addresses,
                DataCollectionNames.Phones,
                DataCollectionNames.Relations
            ]);
        }
        return agentDTOLoadTree;
    }
}
