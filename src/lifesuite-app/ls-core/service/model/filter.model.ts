import { IServerFilter } from 'life-core/service';
import { SQLCompareOperators } from 'life-core/component/grid';

export class Filter implements IServerFilter {
    public readonly $type: string = 'life.common.database.Filter, UICommon';
}

export class SingleFieldFilter extends Filter {
    public readonly $type: string = 'life.common.database.SingleFieldFilter, UICommon';

    public field: string;
}

export class BooleanFilter extends SingleFieldFilter {
    public readonly $type: string = 'life.common.database.BooleanFilter, UICommon';

    public filter: boolean;

    constructor(field: string, filterValue: boolean) {
        super();
        this.field = field;
        this.filter = filterValue;
    }
}

export class SimpleTextFilter extends SingleFieldFilter {
    public readonly $type: string = 'life.common.database.SimpleTextFilter, UICommon';

    public filter: string;

    public compareOp: string;

    constructor(field: string, filter: string, compareOp: string = SQLCompareOperators.LIKE) {
        super();
        this.field = field;
        this.filter = filter;
        this.compareOp = compareOp;
    }
}

export class NumericFilter extends SingleFieldFilter {
    public readonly $type: string = 'life.common.database.NumericFilter, UICommon';

    public filterFrom: number;

    public filterTo: number;

    public compareOp: string;

    constructor(field: string, fromValue: number, toValue: number, compareOp: string = '') {
        super();
        this.field = field;
        this.filterFrom = fromValue;
        this.filterTo = toValue;
        this.compareOp = compareOp;
    }
}

export class DateFilter extends SingleFieldFilter {
    public readonly $type: string = 'life.common.database.DateFilter, UICommon';

    public filterFrom: string;

    public filterTo: string;

    public compareOp: string;

    constructor(field: string, filterFrom: string, filterTo: string, compareOp: string = '') {
        super();
        this.field = field;
        this.filterFrom = filterFrom;
        this.filterTo = filterTo;
        this.compareOp = compareOp;
    }
}

export class CompositeFilter extends Filter {
    public readonly $type: string = 'life.common.database.CompositeFilter, UICommon';

    public filters: Array<IServerFilter>;

    constructor(filters: Array<IServerFilter>) {
        super();
        this.filters = filters;
    }
}

export class CompositeANDFilter extends CompositeFilter {
    public readonly $type: string = 'life.common.database.CompositeANDFilter, UICommon';
}

export class CompositeORFilter extends CompositeFilter {
    public readonly $type: string = 'life.common.database.CompositeORFilter, UICommon';
}

export class CompositeTextFilter extends Filter {
    public readonly $type: string = 'life.common.database.CompositeTextFilter, UICommon';

    public fields: Array<string>;

    public filters: Array<string>;
}
