import { PagedDataRequest, SortField } from 'ls-core/service';

export class LogEntryPagedRequest extends PagedDataRequest {
    public readonly $type: string = 'life.ls.ui.ria.dto.requests.LogEntryPagedRequest, LifeSuite.UIServiceDTO';

    public policyId: number;
    public applicantId: number;

    constructor({
        policyId,
        applicantId,
        startIndex,
        numItemsToFetch,
        sortFields = null,
        filters = null
    }: {
        policyId: number;
        applicantId: number;
        startIndex?: number;
        numItemsToFetch?: number;
        sortFields?: Array<SortField>;
        filters?: any[];
    }) {
        super({ startIndex, numItemsToFetch, sortFields, filters });
        this.policyId = policyId || 0;
        this.applicantId = applicantId || 0;
    }
}
