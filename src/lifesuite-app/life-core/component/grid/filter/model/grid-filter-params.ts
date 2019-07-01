import { IFilterParams } from 'ag-grid-community';

export interface IGridFilterParams extends IFilterParams {
    filterOptionExt?: FilterOptionExt;
}

export class FilterOptionExt {
    constructor() {}
}

export class NumericFilterOptionExt extends FilterOptionExt {
    /**
     * Whether this is a range filter. If set false, only filter type available is "equal".
     * Apply to Numeric and Date filters only.
     */
    public isRangeType: boolean = true;

    constructor({ isRangeType }: { isRangeType?: boolean }) {
        super();
        this.isRangeType = isRangeType;
    }
}

export class TextFilterOptionExt extends FilterOptionExt {
    /**
     * regular expression for the input filter
     */
    public regExp?: RegExp;

    /**
     * Filter type such as 'startsWith' and 'contains'.
     */
    public filterType?: string;

    constructor({ regExp, filterType }: { regExp?: RegExp; filterType?: string }) {
        super();
        this.regExp = regExp;
        this.filterType = filterType;
    }
}
