import { SortField } from './sort.model';
import { PagedDataRequest } from './paging-service.model';

export class TaskPagedDataRequest extends PagedDataRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.TaskPagedDataRequest, LifeSuite.UIServiceDTO';
    public teamId: number;
    public userId: number;
    public selectedDate: Date;
    public taskType: string;
    constructor({
        startIndex,
        numItemsToFetch,
        sortFields = null,
        filters = null,
        teamId,
        userId,
        selectedDate,
        taskType
    }: {
        startIndex?: number;
        numItemsToFetch?: number;
        sortFields?: Array<SortField>;
        filters?: any[];
        teamId: number;
        userId: number;
        selectedDate?: Date;
        taskType: string;
    }) {
        super({ startIndex, numItemsToFetch, sortFields, filters });
        this.teamId = teamId || 0;
        this.userId = userId || 0;
        this.selectedDate = selectedDate || new Date();
        this.taskType = taskType;
    }
}
