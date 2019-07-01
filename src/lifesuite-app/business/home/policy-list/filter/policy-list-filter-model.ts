import { StatusCount } from '../applicant-status/status-count';
import { PolicyViewType } from 'business/shared/view-type/policy-view-type';

export class PolicyListFilterModel {
    public selectedUser: number;
    public selectedTeam: number;
    public selectedView: PolicyViewType;
    public selectedStatusCount: StatusCount;
    public selectedRanges: Array<number>;
}
