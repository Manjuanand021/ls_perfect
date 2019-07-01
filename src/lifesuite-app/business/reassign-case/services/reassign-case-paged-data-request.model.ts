import { PagedDataRequest, SortField } from 'ls-core/service';

export class ReassignCasePagedDataRequest extends PagedDataRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.ReassignPolicyPagedDataRequest, LifeSuite.UIServiceDTO';
    public fromUserId: number;
    constructor({
        startIndex,
        numItemsToFetch,
        sortFields = null,
        filters = null,
        fromUserId = 0
    }: {
        startIndex?: number;
        numItemsToFetch?: number;
        sortFields?: Array<SortField>;
        filters?: any[];
        fromUserId: number;
    }) {
        super({ startIndex, numItemsToFetch, sortFields, filters });
        this.fromUserId = fromUserId;
        this.sortFields = sortFields;
    }
}
