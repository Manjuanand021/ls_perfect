export class TaskCountsListModel {
    public header: string;
    public type: string;
    public count: number;
    public buttonWidth: number;
    public onFilterTypeSelected: (event: any) => void;
}
