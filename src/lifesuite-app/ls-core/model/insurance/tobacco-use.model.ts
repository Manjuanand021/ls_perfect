import { BaseModel } from '../core';
import { DBDate } from '../util';

export class TobaccoUseModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.insurance.core.TobaccoUseModel, LifeSuite';

    public RequirementInformationId: object;
    public TobaccoUseId: string;
    public TobaccoTypeId: string;
    public YearsQuit: object;
    public YearsSmoked: object;
    public PacksPerDay: object;
    public QuitDate: DBDate;
}
