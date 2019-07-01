import { BaseModel } from '../core/base.model';

export class CustomerLabReportProxyModel extends BaseModel {
    public readonly $type: string = 'vpi.aus.provider.lab.CustomerLabReportProxy, LifeSuite';

    public LabIdNumber: string;

    public RequirementInformationId: Object;

    public HorlCode: string;

    public Description: string;

    public ResultValue: string;

    public Low: string;

    public High: string;

    public Abnormal: string;

    public Normal: string;

    public RangeText: string;
}
