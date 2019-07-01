import { SortField } from './sort.model';

export class PagedDataRequest {
    public readonly $type: string = 'life.common.PagedDataRequest, UICommon';
    public startIndex?: number;
    public numItemsToFetch?: number;
    public sortFields?: Array<SortField>;
    public filters?: any[];

    constructor({
        startIndex,
        numItemsToFetch,
        sortFields = null,
        filters = null
    }: {
        startIndex?: number;
        numItemsToFetch?: number;
        sortFields?: Array<SortField>;
        filters?: any[];
    }) {
        this.startIndex = startIndex;
        this.numItemsToFetch = numItemsToFetch;
        this.sortFields = sortFields;
        this.filters = filters;
    }
}
