// These filters are standard ag-grid filters internally used by ag-grid
// Do not change them

export class GridFilter {
    public filterType: GridFilterType;
    public type: string;
}

export type GridFilterType = 'text' | 'number' | 'date';

// if no filtering type is specified,
// UI and BE will default the filtering type to 'contains' for simple and composite columns respectively
export class TextGridFilter extends GridFilter {
    public filter: string;

    constructor(type: string, filter: string) {
        super();
        this.filterType = 'text';
        this.type = type || GridFilteringType.Contains;
        this.filter = filter;
    }
}

// if filter value is equal to filterTo value, BE will default the filtering type to 'equals';
// else the filtering type is set to 'inRange'
export class NumericGridFilter extends GridFilter {
    public filter: number;
    public filterTo?: number;

    constructor(type: string, filter: number, filterTo?: number) {
        super();
        this.filterType = 'number';
        this.type = type;
        this.filter = filter;
        this.filterTo = filterTo;
    }
}

// BE will default the filtering type to 'inRange'
export class DateGridFilter extends GridFilter {
    public dateFrom: string;
    public dateTo?: string;

    constructor(type: string, dateFrom: string, dateTo?: string) {
        super();
        this.filterType = 'date';
        this.type = type;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
    }
}

export const GridFilteringType = {
    Equals: 'equals',
    NotEqual: 'notEqual',
    LessThan: 'lessThan',
    LessThanOrEqual: 'lessThanOrEqual',
    GreaterThan: 'greaterThan',
    GreaterThanOrEqual: 'greaterThanOrEqual',
    Contains: 'contains',
    NotContains: 'notContains',
    StartsWith: 'startsWith',
    EndsWith: 'endsWith',
    InRange: 'inRange'
};

export const SQLCompareOperators = {
    EQ: ' = ',
    GT: ' > ',
    LT: ' < ',
    GE: ' >= ',
    LE: ' <= ',
    NEQ: ' <> ',
    LIKE: ' LIKE ',
    WILDCARD: ' WILDCARD LIKE '
};

export const GridFilterCompareOpMap = {
    equals: SQLCompareOperators.EQ,
    // notEqual: SQLCompareOperators.NEQ,
    // lessThan: SQLCompareOperators.LT,
    lessThanOrEqual: SQLCompareOperators.LE,
    // greaterThan: SQLCompareOperators.GT,
    greaterThanOrEqual: SQLCompareOperators.GE,
    startsWith: SQLCompareOperators.LIKE,
    contains: SQLCompareOperators.WILDCARD,
    inRange: ''
};
