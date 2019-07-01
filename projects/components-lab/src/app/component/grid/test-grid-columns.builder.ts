import { Injectable } from '@angular/core';

import { I18n } from 'life-core/i18n';

import {
    BaseGridColumnsBuilder,
    DataGridColumns,
    GridFilterFrameworkComponentType,
    NumericFilterOptionExt,
    TextFilterOptionExt
} from 'life-core/component/grid';

@Injectable()
export class TestGridColumnsBuilder extends BaseGridColumnsBuilder {
    filterButtonParams: any = { applyButton: true, clearButton: true };

    constructor(i18n: I18n) {
        super();
        this.i18n = i18n;
    }

    public build(): DataGridColumns {
        this.resetColumns();
        this.addColumn({
            field: TestGridFields.Country,
            headerName: this.i18n({ value: 'Country', id: 'test.gridheader.country' }),
            width: 100,
            minWidth: 100,
            autoHeight: true,
            filter: GridFilterFrameworkComponentType.TextFilter,
            filterParams: { filterOptionExt: new TextFilterOptionExt({ regExp: /[a-zA-Z]/ }) }
        });
        this.addColumn({
            field: TestGridFields.Downloads,
            headerName: this.i18n({ value: 'Downloads', id: 'test.gridheader.downloads' }),
            width: 100,
            minWidth: 100,
            filter: GridFilterFrameworkComponentType.NumericFilter,
            filterParams: { filterOptionExt: new NumericFilterOptionExt({ isRangeType: false }) }
        });
        this.addColumn({
            field: TestGridFields.Sales,
            headerName: this.i18n({ value: 'Sales', id: 'test.gridheader.sales' }),
            width: 150,
            minWidth: 100,
            filter: GridFilterFrameworkComponentType.NumericFilter
        });
        this.addColumn({
            field: TestGridFields.Date,
            headerName: this.i18n({ value: 'Date', id: 'test.gridheader.date' }),
            width: 150,
            minWidth: 100,
            filter: GridFilterFrameworkComponentType.DateFilter,
            valueFormatter: function(params) {
                if (params.value) return params.value.toLocaleDateString();
                return '';
            }
        });
        return this.columns;
    }
}

const TestGridFields = {
    Country: 'country',
    Downloads: 'downloads',
    Sales: 'sales',
    Date: 'date'
};
