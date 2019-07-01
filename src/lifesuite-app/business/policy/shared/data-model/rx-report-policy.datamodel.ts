import { RXReportProxy } from 'ls-core/model';
import { BasePolicyDataModel } from './base-policy.datamodel';

export class RxReportPolicyDataModel extends BasePolicyDataModel {
    public rxReports: RXReportProxy[];
}
