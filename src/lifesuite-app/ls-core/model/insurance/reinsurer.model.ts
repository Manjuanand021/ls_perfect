import { BaseModel } from '../core';

export class ReinsurerModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.ReinsurerModel, LifeSuite';

    public CoveragePersonReinsurerId: Object;

    public CoveragePersonId: Object;

    public CompanyCode: string;

    public TreatyType: string;

    public CessionNumber: string;

    public ReinsuranceType: string;

    public RetentionAmount: Object;

    public ReinsuranceAmount: Object;

    public AdbReinsuredAmount: Object;

    public Placed: Object;

    public OriginCode: string;

    public ReinsurerRateClass: string;

    public ReinsurerTableRating: string;
}
