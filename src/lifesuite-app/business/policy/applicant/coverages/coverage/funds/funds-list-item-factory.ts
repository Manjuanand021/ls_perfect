import { Injectable } from '@angular/core';

import { CreateItemParams } from 'life-core/component/master-detail';
import { BaseDTOItemFactory } from 'ls-core/component/master-detail';
import { FundAllocationDTO } from 'ls-core/model';

@Injectable()
export class FundAllocationItemFactory extends BaseDTOItemFactory<FundAllocationDTO> {
    public newInstance(createItemParams: CreateItemParams<FundAllocationDTO>): FundAllocationDTO {
        const fundAllocation = new FundAllocationDTO();
        fundAllocation.FundAllocationId = this.getNextId(createItemParams.items, 'FundAllocationId');
        fundAllocation.FundCode = '';
        return fundAllocation;
    }
}