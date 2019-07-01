import { BaseModel } from '../core';

export class ImpairmentRestrictionModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.ImpairmentRestrictionModel, LifeSuite';

    public CoveragePersonImpairmentId: Object;

    public CoveragePersonId: Object;

    public ImpairmentRestrictionCode: string;

    public ImpairmentText: string;
}
