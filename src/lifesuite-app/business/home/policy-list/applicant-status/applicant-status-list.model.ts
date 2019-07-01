import { MenuItem } from 'life-core/component/menu';

export class ApplicantStatusListModel {
    public header: string;
    public statusList: Array<MenuItem>;
    public statusType: number;
    public onStatusSelected: (event: any) => void;
}
