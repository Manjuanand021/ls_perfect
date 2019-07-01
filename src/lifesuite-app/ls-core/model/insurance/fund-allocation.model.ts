import { BaseModel } from '../core';

export class FundAllocationModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.FundAllocationModel, LifeSuite';

    public FundAllocationId: Object;

    public CoveragePersonId: Object;

    public FundCode: string;

    public PercentAllocation: Object;
}
