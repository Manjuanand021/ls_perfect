import { GridSortOrderTypes, SortOrderTypes } from 'ls-core/model/const/sort-order-types';

export class SortField {
    public readonly $type: string = 'life.common.database.SortField, UICommon';

    public field: string;

    public order: number;

    constructor(field: string, order: number) {
        this.field = field;
        this.order = order;
    }
}

export class SortFieldOrder {
    public static getSortOrder(sortText: string): number {
        if (sortText == SortOrderTypes.Ascending) {
            return GridSortOrderTypes.ASCENDING;
        } else if (sortText === SortOrderTypes.Descending) {
            return GridSortOrderTypes.DESCENDING;
        }
        return null;
    }
}
