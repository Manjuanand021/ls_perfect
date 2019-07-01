import { BaseModel } from '../core';

export class AmendmentModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.AmendmentModel, LifeSuite';

    public CoveragePersonAmendmentId: Object;

    public CoveragePersonId: Object;

    public AmendmentType: string;

    public AmendmentCode: string;

    public AmendmentText: string;
}
