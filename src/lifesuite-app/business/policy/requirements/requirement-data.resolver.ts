import { Injector, Injectable } from '@angular/core';

import { DataCollectionNames } from 'ls-core/model';
import { LazyLoadItemsRequest } from 'ls-core/util';
import { BasePolicyDataResolver } from 'business/policy/shared';
import { NTree } from 'ls-core/service/load-bypk';

@Injectable()
export class RequirementDataResolver extends BasePolicyDataResolver {
    constructor(injector: Injector) {
        super(injector);
    }

    protected loadLazyData(): Promise<any> {
        const request = new LazyLoadItemsRequest();
        request.addLazyLoadItem(this.policy, DataCollectionNames.Insureds, this.getInsuredLazyLoadTree());
        request.addLazyLoadItem(this.policy, DataCollectionNames.Requirements, this.getRequirementLazyLoadTree());

        return this.lazyDataLoader.batchLoad(request);
    }

    private getInsuredLazyLoadTree(): NTree<string> {
        const insuredDTOLoadTree = new NTree<string>(DataCollectionNames.Insureds);
        {
            insuredDTOLoadTree.AddChildren([
                DataCollectionNames.Addresses,
                DataCollectionNames.Phones,
                DataCollectionNames.RelatedPolicies,
                DataCollectionNames.Applications
            ]);
        }
        const partyRelationsNode = insuredDTOLoadTree.AddChild(DataCollectionNames.Relations);
        {
            partyRelationsNode.AddChildren([DataCollectionNames.Addresses, DataCollectionNames.Phones]);
        }
        return insuredDTOLoadTree;
    }

    private getRequirementLazyLoadTree(): NTree<string> {
        const requirementDTOLoadTree = new NTree<string>(DataCollectionNames.Requirements);
        {
            requirementDTOLoadTree.AddChildren([DataCollectionNames.EvidenceStatuses]);
        }

        return requirementDTOLoadTree;
    }
}
